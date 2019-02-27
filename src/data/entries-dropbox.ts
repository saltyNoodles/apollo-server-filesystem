import * as matter from 'gray-matter';
import * as path from 'path';

import { getSingleFile, listFiles, uploadFile } from '../utils/dropbox';

export const getEntry = async (slug: string) => {
  const data = await getSingleFile(`${slug}.md`);
  return getFileContents({ filename: slug, fileContents: data.fileContents });
};

export const allEntries = async () => {
  const files = await listFiles();

  const entries = files.filter(({ filename }) => filename.includes('.md')).map(getFileContents);

  return entries;
};

export const createEntry = async ({
  title,
  author,
  body,
  slug,
}: {
  title: string;
  author: string;
  body: string;
  slug: string;
}) => {
  // Grab the data for the yaml front matter
  const frontMatterData = {
    title,
    author,
  };

  // User Gray Matter to add the frontmatter into the body string, creating the final contents of our file.
  const createdFile = matter.stringify(body, frontMatterData);

  // Write the file to disk
  await uploadFile({ filename: `${slug}`, fileContents: createdFile, mode: 'add' });

  // Return the data of the created file
  return {
    title,
    author,
    body,
    slug,
  };
};

// Update an existing entry in Dropbox with the provided data
export const updateEntry = async ({
  title,
  author,
  body,
  slug,
}: {
  title: string;
  author: string;
  body: string;
  slug: string;
}) => {
  try {
    // Get the original data
    const originalData = await getEntry(slug);

    // Replace with new data only if needed
    const newData = {
      title: title || originalData.title,
      author: author || originalData.author,
      body: body || originalData.body,
      slug: slug,
    };

    // Get data for the frontmatter
    const frontMatterData = {
      title: newData.title,
      author: newData.author,
    };

    // User Gray Matter to add the front matter into the body string, creating the final contents of our file.
    const createdFile = matter.stringify(newData.body, frontMatterData);

    // Save the file back to Dropbox
    await uploadFile({ filename: slug, fileContents: createdFile, mode: 'overwrite' });

    // Return the data of the created file
    return newData;
  } catch (e) {
    throw new Error(e);
  }
};

// Get the parsed contents of the provided file returned as (a promise of) an object with relevant data
const getFileContents = async ({ filename, fileContents }: { filename: string; fileContents: string }) => {
  const parsedFile = matter(fileContents);
  return {
    title: parsedFile.data.title,
    author: parsedFile.data.author,
    body: parsedFile.content,
    slug: path.basename(filename, '.md'),
  };
};
