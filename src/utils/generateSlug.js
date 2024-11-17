import { v4 as uuidv4 } from "uuid"; // For generating unique IDs

const generateSlug = (title) => {
      return (
            title
                  .toLowerCase()
                  .trim()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/^-+|-+$/g, "") || uuidv4()
      ); // Fallback to UUID if title is empty
};

export default generateSlug;