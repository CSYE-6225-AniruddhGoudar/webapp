#!/bin/bash

# Download the add-logging-agent-repo.sh script
curl -sSO https://dl.google.com/cloudagents/add-logging-agent-repo.sh

# Install the Ops Agent and start the Google Fluentd service
sudo bash add-logging-agent-repo.sh --also-install
sudo service google-fluentd start

sudo mkdir -p /etc/google-cloud-ops-agent

sudo mv /tmp/loggingAgentConfig.yaml /etc/google-cloud-ops-agent/config.yaml

