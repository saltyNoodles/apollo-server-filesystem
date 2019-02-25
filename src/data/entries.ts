import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

import * as matter from 'gray-matter';

// Currently all functions that get or modify data for entries exists in this single file.
// This works fine for a small project such as this as it keeps it simple,
// but for a larger project it would likely benefit from being split up
// into different folders for queries and mutations

// Promisify filesystem methods so I don't have to deal with callback hell later on
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const exists = promisify(fs.exists);
const writeFile = promisify(fs.writeFile);

// Set the root data directory. This should be broken out eventually, but is fine hard-coded here for now.
const dataRoot = `${__dirname}/../../content/entries`;

// Get a single entry by the slug/filename
export const getEntry = async (slug: string) => {
  const filename = `${slug}.md`;
  const fileExists = await exists(`${dataRoot}/${filename}`);
  if (fileExists) {
    return getFileContents(filename);
  } else {
    throw new Error(`File does not exist`);
  }
};

// Get all entries
export const allEntries = async () => {
  const files = await readdir(dataRoot);

  const entries = files.filter(filename => filename.includes('.md')).map(getFileContents);

  return entries;
};

// Create a single entry using the provides slug as the filename
// This helps ensure unique slugs and allows us to use the slugs as an ID.
// While this isn't super scalable and you'd likely want a unique ID for each
// entry separate from the slug, this works well for what I want to do here.
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
  // Check if file already exists
  const fileExists = await exists(`${dataRoot}/${slug}.md`);

  // If file already exists, throw an error saying so
  if (fileExists) throw new Error('File already exists! Please choose a different slug.');

  // Grab the data for the yaml front matter
  const frontMatterData = {
    title,
    author,
  };

  // User Gray Matter to add the frontmatter into the body string, creating the final contents of our file.
  const createdFile = matter.stringify(body, frontMatterData);

  // Write the file to disk
  await writeFile(`${dataRoot}/${slug}.md`, createdFile);

  // Return the data of the created file
  return {
    title,
    author,
    body,
    slug,
  };
};

// Update an existing entry in the filesystem with the provided data
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
    const originalData = await getEntry(slug);
    const newData = {
      title: title || originalData.title,
      author: author || originalData.author,
      body: body || originalData.body,
      slug: slug,
    };

    const frontMatterData = {
      title: newData.title,
      author: newData.author,
    };

    // User Gray Matter to add the front matter into the body string, creating the final contents of our file.
    const createdFile = matter.stringify(newData.body, frontMatterData);

    await writeFile(`${dataRoot}/${slug}.md`, createdFile);

    // Return the data of the created file
    return newData;
  } catch (e) {
    throw new Error(e);
  }
};

// Get the parsed contents of the provided file returned as (a promise of) an object with relevant data
const getFileContents = async (filename: string) => {
  const rawFile = await readFile(`${dataRoot}/${filename}`);
  const parsedFile = matter(rawFile);
  return {
    title: parsedFile.data.title,
    author: parsedFile.data.author,
    body: parsedFile.content,
    slug: path.basename(filename, '.md'),
  };
};
