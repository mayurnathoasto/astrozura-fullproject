<?php
$yaml = file_get_contents('https://api.prokerala.com/spec/astrology.v2.yaml');
file_put_contents('spec.yaml', $yaml);
echo "\nDownloaded.";
