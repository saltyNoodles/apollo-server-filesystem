import * as program from 'commander';

program.option('-d, --dropbox', 'Run Dropbox example').parse(process.argv);

export const useDropbox = () => {
  if (!!program.dropbox) {
    if (!process.env.DROPBOX_ACCESS_TOKEN) {
      throw new Error('Please provide DROPBOX_ACCESS_TOKEN as an environment variable.');
    } else {
      return true;
    }
  }
  return false;
};
