#!/bin/bash

# Define the URL of the zip file
ZIP_URL="https://raw.githubusercontent.com/nltk/nltk_data/gh-pages/packages/corpora/brown.zip"

# Define the folder name
FOLDER_NAME="brown"

# Get the absolute path of the current directory
CURRENT_DIR=$(pwd)

# Define the absolute path for extraction in the public directory
PUBLIC_DIR="$CURRENT_DIR/public/corps"
EXTRACTION_PATH="$PUBLIC_DIR/$FOLDER_NAME"

# Create the public directory if it doesn't exist
mkdir -p "$PUBLIC_DIR"

# Remove any existing folder with the same name
rm -rf "$EXTRACTION_PATH"

# Download the zip file using curl
curl -o "$PUBLIC_DIR/$FOLDER_NAME.zip" "$ZIP_URL"

# Check if download was successful
if [ $? -eq 0 ]; then
    # Extract the contents of the zip file to the specified directory
    unzip "$PUBLIC_DIR/$FOLDER_NAME.zip" -d "$PUBLIC_DIR"
    # Check if extraction was successful
    if [ $? -eq 0 ]; then
        echo "Extraction successful. Files are located in the directory: $EXTRACTION_PATH"

        echo "corps" >> "$EXTRACTION_PATH"/.gitkeep
    else
        echo "Error: Extraction failed."
    fi
    # Clean up: Remove the downloaded zip file
    rm "$PUBLIC_DIR/$FOLDER_NAME.zip"
else
    echo "Error: Download failed. Please check the URL and try again."
fi
