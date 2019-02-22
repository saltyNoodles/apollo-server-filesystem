import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

import * as matter from 'gray-matter';

// Promisify filesystem methods so I don't have to deal with callback hell later on
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const exists = promisify(fs.exists);
const writeFile = promisify(fs.writeFile);

// Set the root data directory. This should be broken out eventually, but is fine here for now.
const dataRoot = `${__dirname}/../../data/entries`;

export const getEntry = async (slug: string) => {
  const filename = `${slug}.md`;
  const fileExists = await exists(`${dataRoot}/${filename}`);
  if (fileExists) {
    return getFileContents(filename);
  } else {
    throw new Error(`File does not exist`);
  }
};

export const allEntries = async () => {
  const files = await readdir(dataRoot);

  const entries = files.filter(filename => filename.includes('.md')).map(getFileContents);

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
