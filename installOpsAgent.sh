#!/bin/bash

# Download the add-logging-agent-repo.sh script
curl -sSO https://dl.google.com/cloudagents/add-google-cloud-ops-agent-repo.sh
sudo bash add-google-cloud-ops-agent-repo.sh --also-install

#sudo service google-fluentd start

sudo mkdir -p /etc/google-cloud-ops-agent

sudo mv /tmp/loggingAgentConfig.yaml /etc/google-cloud-ops-agent/config.yaml

