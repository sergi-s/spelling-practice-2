#!/bin/bash

# Define the URL of the zip file
ZIP_URL="https://raw.githubusercontent.com/nltk/nltk_data/gh-pages/packages/corpora/brown.zip"

# Define the folder name
FOLDER_NAME="brown"

# Download the zip file using curl
curl -o "$FOLDER_NAME.zip" "$ZIP_URL"

# Check if download was successful
if [ $? -eq 0 ]; then
    # Extract the contents of the zip file
    unzip "$FOLDER_NAME.zip" -d .
    # Check if extraction was successful
    if [ $? -eq 0 ]; then
        echo "Extraction successful. Files are located in the current directory."

        echo "corps" >>"$FOLDER_NAME"/.gitkeep
    else
        echo "Error: Extraction failed."
    fi
    # Clean up: Remove the downloaded zip file
    rm "$FOLDER_NAME.zip"
else
    echo "Error: Download failed. Please check the URL and try again."
fi
