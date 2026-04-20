import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaBolt,
  FaClock,
  FaComments,
  FaMicrophone,
  FaMicrophoneSlash,
  FaPaperPlane,
  FaPhoneAlt,
  FaPhoneSlash,
  FaPlayCircle,
  FaPowerOff,
  FaRegCircle,
  FaUserCircle,
} from "react-icons/fa";
import { ZIM, ZIMConversationType, ZIMMessagePriority, ZIMMessageType } from "zego-zim-web";
import { ZegoExpressEngine } from "zego-express-engine-webrtc";

import { useAuth } from "../context/AuthContext";
import {
  endBookingSession,
  getBookingSession,
  pingBookingSession,
  startBookingSession,
} from "../api/sessionApi";

const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api").replace(
  /\/index\.php\/api$|\/api$/,
  ""
);
const CLOSED_STATUSES = new Set(["completed", "cancelled", "declined"]);

const resolveImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
};

const formatDateTime = (value) =>
  value
    ? new Date(value).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "-";

const formatTime = (value) =>
  value
    ? new Date(value).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

const formatCountdown = (seconds) => {
  const safeSeconds = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

const getRealtimeErrorMessage = (error, fallback) => {
  const code = error?.code ?? error?.response?.data?.code;

  if (code === 6000014) {
    return "ZEGO chat service is not active for this project yet. Booking details are still available.";
  }

  return error?.message || error?.response?.data?.message || fallback;
};

const getBookingId = (params, location) => {
  if (params.bookingId) return params.bookingId;
  const search = new URLSearchParams(location.search);
  return search.get("booking");
};

const getDisplayMessageText = (message) => {
  if (message?.type === ZIMMessageType.Text && typeof message.message === "string") {
    return message.message;
  }

  return "[Unsupported message]";
};

const mapChatMessage = (message, selfUserId) => ({
  id:
    message?.messageID ||
    message?.localMessageID ||
    `${message?.senderUserID || "unknown"}-${message?.timestamp || Date.now()}`,
  senderUserId: message?.senderUserID || "",
  text: getDisplayMessageText(message),
  timestamp: message?.timestamp || Date.now(),
  isSelf: message?.senderUserID === selfUserId,
});

export default function ChatPage() {
  const { bookingId: routeBookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const bookingId = getBookingId({ bookingId: routeBookingId }, location);

  const [booking, setBooking] = useState(null);
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pageError, setPageError] = useState("");
  const [banner, setBanner] = useState("");
  const [chatReady, setChatReady] = useState(false);
  const [chatStatus, setChatStatus] = useState("Connecting to room...");
  const [sending, setSending] = useState(false);
  const [startingSession, setStartingSession] = useState(false);
  const [endingSession, setEndingSession] = useState(false);
  const [callLoading, setCallLoading] = useState(false);
  const [callState, setCallState] = useState("idle");
  const [callStatus, setCallStatus] = useState("Audio call is not connected.");
  const [callMuted, setCallMuted] = useState(false);
  const [remoteParticipantCount, setRemoteParticipantCount] = useState(0);

  const scrollAnchorRef = useRef(null);
  const zimRef = useRef(null);
  const zimContextKeyRef = useRef("");
  const zegoEngineRef = useRef(null);
  const localStreamRef = useRef(null);
  const publishedStreamIdRef = useRef("");
  const remoteAudioMapRef = useRef(new Map());
  const activeRemoteStreamsRef = useRef(new Set());
  const messageKeysRef = useRef(new Set());
  const pollTimerRef = useRef(null);
  const pingTimerRef = useRef(null);
  const chatSyncTimerRef = useRef(null);

  const isAstrologerViewer =
    user?.id && booking ? Number(user.id) === Number(booking.astrologer_id) : user?.role === "astrologer";
  const counterpart = useMemo(() => {
    if (!booking) return null;
    return isAstrologerViewer ? booking.user : booking.astrologer;
  }, [booking, isAstrologerViewer]);
  const astrologerDetail =
    booking?.astrologer?.astrologer_detail || booking?.astrologer?.astrologerDetail || null;
  const viewerZegoId = session?.viewer?.zego_user_id || "";
  const canOpenChat = Boolean(session?.can_join && session?.zego?.chat);
  const isClosed = CLOSED_STATUSES.has(booking?.status) || session?.state === "closed";
  const callEnabled = booking?.consultation_type === "call";
  const canJoinCall = Boolean(callEnabled && session?.can_join && session?.zego?.call);
  const showLowTimeWarning = Boolean(session?.needs_low_time_warning && session?.remaining_seconds > 0);
  const backHref = isAstrologerViewer ? "/astrologer/dashboard" : "/my-bookings";

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  useEffect(() => {
    if (!banner) return undefined;
    const timer = window.setTimeout(() => setBanner(""), 2800);
    return () => window.clearTimeout(timer);
  }, [banner]);

  const mergeMessages = (nextMessages, replace = false) => {
    setMessages((previous) => {
      const base = replace ? [] : [...previous];
      const keySet = replace ? new Set() : new Set(messageKeysRef.current);

      nextMessages.forEach((message) => {
        const messageKey = message.id;
        if (!messageKey || keySet.has(messageKey)) {
          return;
        }

        keySet.add(messageKey);
        base.push(message);
      });

      base.sort((left, right) => left.timestamp - right.timestamp);
      messageKeysRef.current = keySet;
      return base;
    });
  };

  const resetMessages = (nextMessages) => {
    messageKeysRef.current = new Set();
    setMessages([]);
    mergeMessages(nextMessages, true);
  };

  const destroyChatConnection = async (roomId = "") => {
    const zim = zimRef.current;

    if (zim) {
      try {
        zim.off("roomMessageReceived");
      } catch {}

      try {
        zim.off("connectionStateChanged");
      } catch {}

      try {
        zim.off("tokenWillExpire");
      } catch {}

      try {
        if (roomId) {
          await zim.leaveRoom(roomId);
        }
      } catch {}

      try {
        zim.logout();
      } catch {}

      try {
        zim.destroy();
      } catch {}
    }

    zimRef.current = null;
    zimContextKeyRef.current = "";
    setChatReady(false);
    setChatStatus("Chat room disconnected.");
  };

  const stopAllRemoteAudio = () => {
    remoteAudioMapRef.current.forEach((audioEl) => {
      audioEl.pause();
      audioEl.srcObject = null;
    });
    remoteAudioMapRef.current.clear();
    activeRemoteStreamsRef.current.clear();
    setRemoteParticipantCount(0);
  };

  const destroyCallConnection = (roomId = "") => {
    const engine = zegoEngineRef.current;

    if (engine && publishedStreamIdRef.current) {
      try {
        engine.stopPublishingStream(publishedStreamIdRef.current);
      } catch {}
    }

    if (engine) {
      activeRemoteStreamsRef.current.forEach((streamId) => {
        try {
          engine.stopPlayingStream(streamId);
        } catch {}
      });

      try {
        if (roomId) {
          engine.logoutRoom(roomId);
        }
      } catch {}

      try {
        engine.destroyEngine();
      } catch {}
    }

    if (localStreamRef.current) {
      try {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      } catch {}
    }

    stopAllRemoteAudio();
    localStreamRef.current = null;
    zegoEngineRef.current = null;
    publishedStreamIdRef.current = "";
    setCallMuted(false);
    setCallState("idle");
    setCallStatus("Audio call is not connected.");
  };

  const teardownRealtime = async () => {
    destroyCallConnection(session?.rooms?.call || "");
    await destroyChatConnection(session?.rooms?.chat || "");
  };

  const loadHistoryMessages = async (zimInstance, currentSession) => {
    const history = await zimInstance.queryHistoryMessage(
      currentSession.rooms.chat,
      ZIMConversationType.Room,
      {
        count: 50,
        reverse: false,
        isPreferQueryFromServer: true,
      }
    );

    const normalized = (history?.messageList || [])
      .map((message) => mapChatMessage(message, currentSession.viewer.zego_user_id))
      .filter((message) => message.text);

    resetMessages(normalized);
  };

  const ensureChatConnection = async (currentBooking, currentSession) => {
    if (!currentSession?.can_join || !currentSession?.zego?.chat) {
      if (zimRef.current) {
        await destroyChatConnection(currentSession?.rooms?.chat || "");
      }
      return;
    }

    const chatConfig = currentSession.zego.chat;
    const roomId = currentSession.rooms.chat;
    const roomKey = `${chatConfig.app_id}:${chatConfig.user_id}:${roomId}`;

    if (zimRef.current && zimContextKeyRef.current === roomKey) {
      setChatReady(true);
      setChatStatus("Connected to live chat.");
      await loadHistoryMessages(zimRef.current, currentSession);
      return;
    }

    await destroyChatConnection(roomId);

    const zimInstance = ZIM.create({ appID: chatConfig.app_id }) || ZIM.getInstance();
    if (!zimInstance) {
      throw new Error("Unable to initialize the chat engine.");
    }

    zimRef.current = zimInstance;
    zimContextKeyRef.current = roomKey;

    zimInstance.on("connectionStateChanged", (_zim, data) => {
      const nextStatus =
        data?.state === 2
          ? "Connected to live chat."
          : data?.state === 1
            ? "Connecting to live chat..."
            : "Chat connection lost.";
      setChatStatus(nextStatus);
    });

    zimInstance.on("tokenWillExpire", async () => {
      try {
        const refreshed = await getBookingSession(currentBooking.id);
        const refreshedChat = refreshed?.session?.zego?.chat;
        if (refreshedChat?.token) {
          await zimInstance.renewToken(refreshedChat.token);
        }
      } catch (error) {
        console.error("Failed to renew ZIM token", error);
      }
    });

    zimInstance.on("roomMessageReceived", (_zim, data) => {
      const normalized = (data?.messageList || []).map((message) =>
        mapChatMessage(message, currentSession.viewer.zego_user_id)
      );
      mergeMessages(normalized);
    });

    await zimInstance.login(chatConfig.user_id, {
      token: chatConfig.token,
      userName: chatConfig.user_name,
    });

    await zimInstance.enterRoom({
      roomID: roomId,
      roomName: roomId,
    });

    await loadHistoryMessages(zimInstance, currentSession);
    setChatReady(true);
    setChatStatus("Connected to live chat.");
  };

  const playRemoteStream = async (engine, streamId) => {
    if (activeRemoteStreamsRef.current.has(streamId)) {
      return;
    }

    const mediaStream = await engine.startPlayingStream(streamId);
    const audioEl = new Audio();
    audioEl.autoplay = true;
    audioEl.playsInline = true;
    audioEl.srcObject = mediaStream;
    await audioEl.play().catch(() => undefined);

    activeRemoteStreamsRef.current.add(streamId);
    remoteAudioMapRef.current.set(streamId, audioEl);
    setRemoteParticipantCount(activeRemoteStreamsRef.current.size);
  };

  const stopRemoteStream = (engine, streamId) => {
    try {
      engine.stopPlayingStream(streamId);
    } catch {}

    const audioEl = remoteAudioMapRef.current.get(streamId);
    if (audioEl) {
      audioEl.pause();
      audioEl.srcObject = null;
      remoteAudioMapRef.current.delete(streamId);
    }

    activeRemoteStreamsRef.current.delete(streamId);
    setRemoteParticipantCount(activeRemoteStreamsRef.current.size);
  };

  const connectAudioRoom = async (currentSession) => {
    if (!currentSession?.zego?.call || !currentSession?.rooms?.call) {
      throw new Error("Audio room is not available for this consultation.");
    }

    if (zegoEngineRef.current) {
      return zegoEngineRef.current;
    }

    const callConfig = currentSession.zego.call;
    const serverList = [callConfig.server_url, callConfig.secondary_server_url].filter(Boolean);
    const engine = new ZegoExpressEngine(callConfig.app_id, serverList);

    engine.on("roomStateUpdate", (_roomId, state, errorCode) => {
      if (state === "CONNECTED") {
        setCallState("room-connected");
        setCallStatus("Audio room connected.");
        return;
      }

      if (state === "CONNECTING") {
        setCallState("connecting");
        setCallStatus("Connecting audio room...");
        return;
      }

      if (errorCode) {
        setCallState("error");
        setCallStatus(`Audio room disconnected (${errorCode}).`);
        return;
      }

      setCallState("idle");
      setCallStatus("Audio room disconnected.");
    });

    engine.on("roomUserUpdate", (_roomId, updateType, userList) => {
      if (updateType === "ADD") {
        setRemoteParticipantCount((count) => count + userList.length);
      }

      if (updateType === "DELETE") {
        setRemoteParticipantCount((count) => Math.max(0, count - userList.length));
      }
    });

    engine.on("roomStreamUpdate", async (_roomId, updateType, streamList) => {
      if (updateType === "DELETE") {
        streamList.forEach((stream) => stopRemoteStream(engine, stream.streamID));
        return;
      }

      for (const stream of streamList) {
        if (stream?.user?.userID === currentSession.viewer.zego_user_id) {
          continue;
        }

        try {
          await playRemoteStream(engine, stream.streamID);
          setCallStatus("Remote participant connected.");
        } catch (error) {
          console.error("Failed to play remote stream", error);
          setCallState("error");
          setCallStatus("Remote audio could not be played.");
        }
      }
    });

    await engine.loginRoom(
      currentSession.rooms.call,
      callConfig.token,
      {
        userID: callConfig.user_id,
        userName: callConfig.user_name,
      },
      {
        userUpdate: true,
      }
    );

    zegoEngineRef.current = engine;
    return engine;
  };

  const startLocalAudio = async (engine, currentSession) => {
    if (localStreamRef.current && publishedStreamIdRef.current) {
      return;
    }

    const localStream = await engine.createStream({
      camera: {
        audio: true,
        video: false,
      },
    });

    localStreamRef.current = localStream;
    const streamId = currentSession.rooms.stream;
    publishedStreamIdRef.current = streamId;
    engine.startPublishingStream(streamId, localStream);

    setCallState("live");
    setCallStatus("Audio call is live.");
  };

  const refreshSession = async (options = {}) => {
    const { silent = false } = options;

    if (!bookingId) {
      setLoading(false);
      setPageError("A valid booking session was not provided.");
      return;
    }

    try {
      if (!silent) {
        setPageError("");
      }

      if (!silent && !loading) {
        setRefreshing(true);
      }

      const response = await getBookingSession(bookingId);
      setBooking(response.booking);
      setSession(response.session);

      if (response.session?.can_join && response.session?.zego?.chat) {
        try {
          await ensureChatConnection(response.booking, response.session);
        } catch (error) {
          console.error("Failed to connect chat room", error);
          setChatReady(false);
          setChatStatus(getRealtimeErrorMessage(error, "Live chat is currently unavailable."));
        }
      } else if (zimRef.current) {
        await destroyChatConnection(response.session?.rooms?.chat || "");
      }

      if (CLOSED_STATUSES.has(response.booking?.status) || response.session?.state === "closed") {
        destroyCallConnection(response.session?.rooms?.call || "");
      }
    } catch (error) {
      console.error("Failed to load booking session", error);
      setPageError(getRealtimeErrorMessage(error, "Unable to load this consultation."));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void refreshSession();

    pollTimerRef.current = window.setInterval(() => {
      void refreshSession({ silent: true });
    }, 15000);

    return () => {
      if (pollTimerRef.current) {
        window.clearInterval(pollTimerRef.current);
      }
    };
  }, [bookingId]);

  useEffect(() => {
    if (pingTimerRef.current) {
      window.clearInterval(pingTimerRef.current);
    }

    if (!bookingId || !session?.can_join || isClosed) {
      return undefined;
    }

    pingTimerRef.current = window.setInterval(() => {
      void pingBookingSession(bookingId).catch((error) => {
        console.error("Session ping failed", error);
      });
    }, 20000);

    return () => {
      if (pingTimerRef.current) {
        window.clearInterval(pingTimerRef.current);
      }
    };
  }, [bookingId, session?.can_join, isClosed]);

  useEffect(() => {
    if (chatSyncTimerRef.current) {
      window.clearInterval(chatSyncTimerRef.current);
    }

    if (!session?.can_join || !chatReady || !zimRef.current || isClosed) {
      return undefined;
    }

    chatSyncTimerRef.current = window.setInterval(() => {
      void loadHistoryMessages(zimRef.current, session).catch((error) => {
        console.error("Chat history sync failed", error);
      });
    }, 4000);

    return () => {
      if (chatSyncTimerRef.current) {
        window.clearInterval(chatSyncTimerRef.current);
      }
    };
  }, [chatReady, isClosed, session]);

  useEffect(() => {
    return () => {
      if (chatSyncTimerRef.current) {
        window.clearInterval(chatSyncTimerRef.current);
      }
      void teardownRealtime();
    };
  }, []);

  const handleStartSession = async () => {
    if (!bookingId) return null;

    try {
      setStartingSession(true);
      const response = await startBookingSession(bookingId);
      setBooking(response.booking);
      setSession(response.session);
      setBanner("Consultation started.");
      return response;
    } catch (error) {
      console.error("Failed to start session", error);
      setBanner(error?.response?.data?.message || "Unable to start the consultation.");
      return null;
    } finally {
      setStartingSession(false);
    }
  };

  const handleEndSession = async () => {
    if (!bookingId) return;

    try {
      setEndingSession(true);
      const response = await endBookingSession(bookingId);
      setBooking(response.booking);
      setSession(response.session);
      destroyCallConnection(response.session?.rooms?.call || "");
      setBanner("Consultation ended.");
    } catch (error) {
      console.error("Failed to end session", error);
      setBanner(error?.response?.data?.message || "Unable to end the consultation.");
    } finally {
      setEndingSession(false);
    }
  };

  const handleSendMessage = async () => {
    const trimmed = draft.trim();

    if (!trimmed || !chatReady || !zimRef.current || !session?.rooms?.chat) {
      return;
    }

    try {
      setSending(true);
      const result = await zimRef.current.sendMessage(
        {
          type: ZIMMessageType.Text,
          message: trimmed,
        },
        session.rooms.chat,
        ZIMConversationType.Room,
        {
          priority: ZIMMessagePriority.Low,
        }
      );

      const sentMessage = mapChatMessage(result.message, viewerZegoId);
      mergeMessages([sentMessage]);
      await loadHistoryMessages(zimRef.current, session);
      setDraft("");
    } catch (error) {
      console.error("Failed to send message", error);
      setBanner("Message could not be sent.");
    } finally {
      setSending(false);
    }
  };

  const handleJoinAudioCall = async () => {
    if (!canJoinCall) {
      setBanner("Audio call is not available yet.");
      return;
    }

    try {
      setCallLoading(true);
      setCallState("connecting");
      setCallStatus("Connecting audio room...");

      let activeSession = session;

      if (!activeSession?.is_live && isAstrologerViewer && activeSession?.can_start) {
        const started = await handleStartSession();
        if (!started) {
          return;
        }
        activeSession = started.session;
      }

      if (!activeSession?.is_live && !isAstrologerViewer) {
        setBanner("Waiting for the astrologer to start the consultation.");
        setCallState("idle");
        setCallStatus("Waiting for the astrologer to start the consultation.");
        return;
      }

      const engine = await connectAudioRoom(activeSession);
      await startLocalAudio(engine, activeSession);
    } catch (error) {
      console.error("Failed to join audio call", error);
      destroyCallConnection(session?.rooms?.call || "");
      setCallState("error");
      setCallStatus(error?.message || "Audio call could not be started.");
      setBanner(error?.message || "Audio call could not be started.");
    } finally {
      setCallLoading(false);
    }
  };

  const handleLeaveAudioCall = () => {
    destroyCallConnection(session?.rooms?.call || "");
    setBanner("Audio call disconnected.");
  };

  const handleToggleMute = () => {
    if (!zegoEngineRef.current) return;

    const nextMuted = !callMuted;

    try {
      zegoEngineRef.current.muteMicrophone(nextMuted);
      setCallMuted(nextMuted);
      setCallStatus(nextMuted ? "Microphone muted." : "Microphone live.");
    } catch (error) {
      console.error("Failed to toggle microphone", error);
      setBanner("Microphone setting could not be updated.");
    }
  };

  if (!bookingId) {
    return (
      <div className="min-h-screen bg-[#f7f8fb] flex items-center justify-center px-4">
        <div className="max-w-lg rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-[#1E3557]">Consultation not found</h1>
          <p className="mt-3 text-sm text-gray-500">
            A booking identifier is required to open a consultation room.
          </p>
          <Link
            to="/my-bookings"
            className="mt-6 inline-flex items-center rounded-xl bg-[#1E3557] px-5 py-3 text-sm font-semibold text-white"
          >
            Go to My Bookings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f5fb] font-sans">
      {banner && (
        <div className="fixed left-1/2 top-5 z-50 -translate-x-1/2 rounded-full bg-[#1E3557] px-6 py-3 text-sm font-semibold text-white shadow-lg">
          {banner}
        </div>
      )}

      <div className="border-b border-[#E3E8F3] bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate(backHref)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 text-[#1E3557] transition hover:border-[#1E3557]"
              aria-label="Go back"
            >
              <FaArrowLeft />
            </button>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4A73C]">
                Consultation Room
              </p>
              <h1 className="mt-1 text-2xl font-bold text-[#1E3557]">
                {booking?.booking_reference || `Booking #${bookingId}`}
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl border border-gray-200 bg-[#F8F9FC] px-4 py-3 text-sm">
              <p className="text-xs uppercase tracking-wide text-gray-400">Session State</p>
              <p className="mt-1 font-semibold text-[#1E3557] capitalize">{session?.state || "loading"}</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-[#F8F9FC] px-4 py-3 text-sm">
              <p className="text-xs uppercase tracking-wide text-gray-400">Time Remaining</p>
              <p className="mt-1 font-semibold text-[#1E3557]">{formatCountdown(session?.remaining_seconds || 0)}</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-[#F8F9FC] px-4 py-3 text-sm">
              <p className="text-xs uppercase tracking-wide text-gray-400">Room Refresh</p>
              <p className="mt-1 font-semibold text-[#1E3557]">{refreshing ? "Refreshing..." : "Live"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:px-8">
        {showLowTimeWarning && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800 shadow-sm">
            Less than two minutes remain in this consultation. The session will automatically close when the booked duration ends.
          </div>
        )}

        {pageError && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700 shadow-sm">
            {pageError}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[60vh] items-center justify-center rounded-3xl border border-gray-200 bg-white shadow-sm">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#D4A73C]"></div>
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <section className="flex min-h-[70vh] flex-col rounded-3xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F6E8BF] text-[#1E3557]">
                    <FaComments />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#1E3557]">Live Consultation Chat</h2>
                    <p className="text-sm text-gray-500">{chatStatus}</p>
                  </div>
                </div>
                <span className="rounded-full bg-[#F8F9FC] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#1E3557]">
                  {booking?.consultation_type === "call" ? "Audio + Chat" : "Chat"}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-5">
                {!canOpenChat ? (
                  <div className="flex h-full min-h-[320px] items-center justify-center">
                    <div className="max-w-md text-center">
                      <p className="text-xl font-bold text-[#1E3557]">
                        {isClosed ? "This consultation is closed." : "Chat room opens at the session window."}
                      </p>
                      <p className="mt-3 text-sm leading-6 text-gray-500">
                        {isClosed
                          ? "The live connection is no longer active, but the booking summary remains available."
                          : "Open the room close to the scheduled time. The astrologer can start the consultation once the booking window opens."}
                      </p>
                    </div>
                  </div>
                ) : messages.length > 0 ? (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isSelf ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                            message.isSelf
                              ? "bg-[#1E3557] text-white"
                              : "border border-gray-100 bg-[#F8F9FC] text-[#1E3557]"
                          }`}
                        >
                          <p className="leading-6">{message.text}</p>
                          <p
                            className={`mt-2 text-[11px] ${
                              message.isSelf ? "text-white/70" : "text-gray-400"
                            }`}
                          >
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={scrollAnchorRef} />
                  </div>
                ) : (
                  <div className="flex h-full min-h-[320px] items-center justify-center">
                    <div className="max-w-md text-center">
                      <p className="text-xl font-bold text-[#1E3557]">No messages yet</p>
                      <p className="mt-3 text-sm leading-6 text-gray-500">
                        This room is ready. The first message sent here will appear live for both the user and astrologer.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 px-5 py-4">
                <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-[#F8F9FC] px-4 py-3">
                  <input
                    type="text"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        void handleSendMessage();
                      }
                    }}
                    disabled={!chatReady || isClosed || sending}
                    placeholder={
                      chatReady ? "Type your message here..." : "Chat becomes active when the session window opens."
                    }
                    className="flex-1 bg-transparent text-sm text-[#1E3557] outline-none placeholder:text-gray-400 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={() => void handleSendMessage()}
                    disabled={!chatReady || isClosed || sending || !draft.trim()}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#D4A73C] text-[#1E3557] transition hover:bg-[#c49530] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FaPaperPlane />
                  </button>
                </div>
              </div>
            </section>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  {resolveImageUrl(counterpart?.astrologer_detail?.profile_image || counterpart?.astrologerDetail?.profile_image || astrologerDetail?.profile_image) ? (
                    <img
                      src={resolveImageUrl(
                        counterpart?.astrologer_detail?.profile_image ||
                          counterpart?.astrologerDetail?.profile_image ||
                          astrologerDetail?.profile_image
                      )}
                      alt={counterpart?.name || "Profile"}
                      className="h-16 w-16 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F6E8BF] text-2xl text-[#1E3557]">
                      <FaUserCircle />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4A73C]">
                      {isAstrologerViewer ? "Client" : "Astrologer"}
                    </p>
                    <h3 className="mt-1 text-xl font-bold text-[#1E3557]">{counterpart?.name || "-"}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {isAstrologerViewer
                        ? counterpart?.email || counterpart?.phone || "Registered user"
                        : astrologerDetail?.specialities || "Consultation expert"}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-[#F8F9FC] px-4 py-3">
                    <p className="text-xs uppercase tracking-wide text-gray-400">Scheduled</p>
                    <p className="mt-1 text-sm font-semibold text-[#1E3557]">
                      {formatDateTime(booking?.scheduled_at)}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#F8F9FC] px-4 py-3">
                    <p className="text-xs uppercase tracking-wide text-gray-400">Duration</p>
                    <p className="mt-1 text-sm font-semibold text-[#1E3557]">{booking?.duration || 0} min</p>
                  </div>
                  <div className="rounded-2xl bg-[#F8F9FC] px-4 py-3">
                    <p className="text-xs uppercase tracking-wide text-gray-400">Type</p>
                    <p className="mt-1 text-sm font-semibold capitalize text-[#1E3557]">
                      {booking?.consultation_type === "call" ? "Audio Call" : "Chat Consultation"}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#F8F9FC] px-4 py-3">
                    <p className="text-xs uppercase tracking-wide text-gray-400">Amount</p>
                    <p className="mt-1 text-sm font-semibold text-[#1E3557]">Rs {booking?.amount || 0}</p>
                  </div>
                </div>

                {booking?.notes && (
                  <div className="mt-4 rounded-2xl border border-gray-100 bg-[#F8F9FC] px-4 py-3 text-sm text-gray-600">
                    {booking.notes}
                  </div>
                )}
              </div>

              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F6E8BF] text-[#1E3557]">
                    <FaPhoneAlt />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1E3557]">Session Controls</h3>
                    <p className="text-sm text-gray-500">{callEnabled ? callStatus : "Chat-only consultation."}</p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-[#F8F9FC] px-4 py-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#1E3557]">
                      <FaClock className="text-[#D4A73C]" />
                      Remaining Time
                    </div>
                    <span className="text-sm font-bold text-[#1E3557]">
                      {formatCountdown(session?.remaining_seconds || 0)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-[#F8F9FC] px-4 py-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#1E3557]">
                      <FaRegCircle className="text-[#D4A73C]" />
                      Remote Participant
                    </div>
                    <span className="text-sm font-bold text-[#1E3557]">{remoteParticipantCount}</span>
                  </div>

                  {isAstrologerViewer && session?.can_start && !session?.is_live && (
                    <button
                      type="button"
                      onClick={() => void handleStartSession()}
                      disabled={startingSession}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#D4A73C] px-5 py-3 text-sm font-bold text-[#1E3557] transition hover:bg-[#c49530] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <FaPlayCircle />
                      {startingSession ? "Starting..." : "Start Consultation"}
                    </button>
                  )}

                  {callEnabled && (
                    <>
                      <button
                        type="button"
                        onClick={() => void handleJoinAudioCall()}
                        disabled={!canJoinCall || callLoading || isClosed}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1E3557] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#162744] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <FaPhoneAlt />
                        {callLoading
                          ? "Connecting..."
                          : callState === "live" || callState === "room-connected"
                            ? "Reconnect Audio Call"
                            : "Join Audio Call"}
                      </button>

                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={handleToggleMute}
                          disabled={!zegoEngineRef.current || !localStreamRef.current}
                          className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold text-[#1E3557] transition hover:border-[#1E3557] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {callMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
                          {callMuted ? "Unmute" : "Mute"}
                        </button>

                        <button
                          type="button"
                          onClick={handleLeaveAudioCall}
                          disabled={!zegoEngineRef.current}
                          className="flex items-center justify-center gap-2 rounded-2xl border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <FaPhoneSlash />
                          Leave Call
                        </button>
                      </div>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => void handleEndSession()}
                    disabled={!session?.can_end || endingSession || isClosed}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 px-5 py-3 text-sm font-semibold text-[#1E3557] transition hover:border-[#1E3557] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FaPowerOff />
                    {endingSession ? "Ending..." : "End Consultation"}
                  </button>
                </div>
              </div>

              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-[#1E3557]">Session Metadata</h3>
                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-gray-500">Booking Status</span>
                    <span className="font-semibold capitalize text-[#1E3557]">{booking?.status || "-"}</span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-gray-500">Join Window Opens</span>
                    <span className="text-right font-semibold text-[#1E3557]">
                      {formatDateTime(session?.join_window?.starts_at)}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-gray-500">Join Window Closes</span>
                    <span className="text-right font-semibold text-[#1E3557]">
                      {formatDateTime(session?.join_window?.ends_at)}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-gray-500">Started At</span>
                    <span className="text-right font-semibold text-[#1E3557]">
                      {formatDateTime(session?.started_at)}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-gray-500">Ended At</span>
                    <span className="text-right font-semibold text-[#1E3557]">
                      {formatDateTime(session?.ended_at)}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-gray-500">End Reason</span>
                    <span className="text-right font-semibold capitalize text-[#1E3557]">
                      {(session?.end_reason || "-").replaceAll("_", " ")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-sm text-emerald-800 shadow-sm">
                <div className="flex items-start gap-3">
                  <FaBolt className="mt-0.5 text-emerald-600" />
                  <p>
                    Real-time booking state, chat access, and audio room authentication are controlled from Laravel for this session. If timing or access changes, this page refreshes automatically.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
