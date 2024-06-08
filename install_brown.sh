#!/bin/bash

# Define the URL of the zip file
ZIP_URL="https://raw.githubusercontent.com/nltk/nltk_data/gh-pages/packages/corpora/brown.zip"

# Define the folder name
FOLDER_NAME="brown"

# Get the absolute path of the current directory
CURRENT_DIR=$(pwd)

# Define the absolute path for extraction
EXTRACTION_PATH="$CURRENT_DIR/$FOLDER_NAME"

# Download the zip file using curl
curl -o "$FOLDER_NAME.zip" "$ZIP_URL"

# Check if download was successful
if [ $? -eq 0 ]; then
    # Extract the contents of the zip file to the specified directory
    unzip "$FOLDER_NAME.zip" -d "$CURRENT_DIR"
    # Check if extraction was successful
    if [ $? -eq 0 ]; then
        echo "Extraction successful. Files are located in the directory: $EXTRACTION_PATH"

        echo "corps" >> "$EXTRACTION_PATH"/.gitkeep
    else
        echo "Error: Extraction failed."
    fi
    # Clean up: Remove the downloaded zip file
    rm "$FOLDER_NAME.zip"
else
    echo "Error: Download failed. Please check the URL and try again."
fi
