import axios from 'axios';
import * as path from 'path';

// These must be set in a custom .env file within the project root to get this working.
export const DROPBOX_ACCESS_TOKEN = process.env.DROPBOX_ACCESS_TOKEN;
export const CONTENT_DIRECTORY = process.env.DROPBOX_CONTENT_DIRECTORY || 'graphql-filesystem-example';

export const getSingleFile = async (filename: string) => {
  try {
    const res = await axios.post('https://content.dropboxapi.com/2/files/download', null, {
      headers: {
        Authorization: `Bearer ${DROPBOX_ACCESS_TOKEN}`,
        'Dropbox-API-Arg': JSON.stringify({
          path: `/${CONTENT_DIRECTORY}/${filename}`,
        }),
        'Content-Type': 'text/plain',
      },
    });

    return {
      filename: filename,
      fileContents: res.data,
    };
  } catch (e) {
    throw new Error('Unable to get file');
  }
};

// Upload a given file to the Dropbox content directory
export const uploadFile = async ({
  filename,
  fileContents,
  mode = 'add',
}: {
  filename: string;
  fileContents: string;
  mode: string | null;
}) => {
  try {
    const response = await axios.post('https://content.dropboxapi.com/2/files/upload', fileContents, {
      headers: {
        authorization: `Bearer ${DROPBOX_ACCESS_TOKEN}`,
        'Dropbox-API-Arg': JSON.stringify({
          path: `/${CONTENT_DIRECTORY}/${filename}.md`,
          mode: mode,
        }),
        'Content-Type': 'text/plain; charset=dropbox-cors-hack',
      },
    });
    return response;
  } catch (e) {
    throw new Error(`Error uploading file: ${JSON.stringify(e.response.data, null, 2)}`);
  }
};

// List all files within the main content directory
export const listFiles = async () => {
  try {
    const { data } = await axios.post(
      'https://api.dropboxapi.com/2/files/list_folder',
      {
        path: `/${CONTENT_DIRECTORY}`,
      },
      {
        headers: {
          authorization: `Bearer ${DROPBOX_ACCESS_TOKEN}`,
        },
      }
    );
    const entries = data.entries
      .map(async entry => {
        // If the entry isn't a file return null
        if (entry['.tag'] !== 'file') return null;

        // Get the actual file
        try {
          return getSingleFile(entry.name);
        } catch (e) {
          // In the case of an error, just return null
          return null;
        }
      })
      .filter(entry => !!entry);
    return Promise.all(entries);
  } catch (e) {
    throw new Error(`Error reading directory: ${JSON.stringify(e.response.data, null, 2)}`);
  }
};
