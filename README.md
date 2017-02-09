# rsyncer
Node module to run rsync when a directory changes

# Modules:

*node-inotifywait* - Stéphane Gully

# Dependancies:

inotify-tools

# Usage:

    rsyncer -p /path/to/directory/to/sync/ -t username@host:/destination/path -e exclude_dir
