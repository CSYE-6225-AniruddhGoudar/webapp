locals {
  # https://www.packer.io/docs/templates/hcl_templates/functions/datetime/formatdate
  datestamp = formatdate("YYYYMMDD", timestamp())

  # https://www.packer.io/docs/templates/hcl_templates/functions/string/replace
  # because GCP image name cannot have '.' in its name
  #image_consul_version = replace(var.consul_version, ".", "-")
}

packer {
  required_plugins {
    googlecompute = {
      source  = "github.com/hashicorp/googlecompute"
      version = ">=1.0.0, < 2.0.0"
    }
  }
}

variable "project_id" {
  type    = string
  default = "emerald-trilogy-411720"
}

variable "source_image_family" {
  type    = string
  default = "centos-stream-8"
}

variable "image_family" {
  type    = string
  default = "csye-image"
}

variable "zone" {
  type    = string
  default = "us-east1-b"
}

variable "source_image" {
  type    = string
  default = ""
}

variable "disk_size" {
  type    = number
  default = 20
}

variable "disk_type" {
  type    = string
  default = "pd-standard"
}

variable "machine_type" {
  type    = string
  default = "n1-standard-1"
}

source "googlecompute" "csye_image_custom" {
  project_id   = var.project_id
  zone         = var.zone
  machine_type = var.machine_type
  ssh_username = "packer"
  use_os_login = "false"

  # use custom base image that was built
  source_image_family = var.source_image_family

  image_family            = var.image_family
  image_name              = "csye-centos-${local.datestamp}-{{timestamp}}"
  image_description       = "CentOS, CentOS, Stream 8, x86_64 built on 20240110"
  image_storage_locations = ["us"]
  credentials_file        = "emerald-trilogy-411720-70e2ecefe45d.json"
  network                 = "default"

  tags = ["packer"]
}

build {
  sources = [
    "source.googlecompute.csye_image_custom"
  ]

  provisioner "file" {
    source      = "webapp.zip"
    destination = "/tmp/"
  }

  provisioner "file" {
    source      = "webapp.service"
    destination = "/tmp/"
  }

  provisioner "shell" {
    scripts = [
      "installscript.sh",
      "user.sh",
      "systemD.sh"
    ]
}

}