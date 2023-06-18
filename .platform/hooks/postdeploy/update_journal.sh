#!/bin/bash

cp /var/app/current/.platform/systemd/journald.conf /etc/systemd/journald.conf
service systemd-journald restart
