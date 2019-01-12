#!/usr/bin/env bash

# This is run by circle.yml script as part of continuous integration
# to run manually, pass in a --version=$SERVICE_VERSION argument

    # deploy to AppEngine
    # where $1 = --version=$SERVICE_VERSION
    gcloud -q app deploy app.yaml --promote --version=1