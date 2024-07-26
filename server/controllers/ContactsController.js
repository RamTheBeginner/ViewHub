import User from "../models/UserModel.js";

export const searchContacts = async (request, response, next) => {
  try {
    const { searchTerm } = request.body;

    if (!searchTerm) {
      return response.status(400).json({ message: "searchTerm is required" });
    }

    // Escape special regex characters in the search term
    const sanitizedSearchTerm = searchTerm.replace(
      /[.*+?^${}()|[\]\\]/g, // Matching special regex characters
      "\\$&"
    );

    // Creating a case-insensitive regular expression
    const regex = new RegExp(sanitizedSearchTerm, "i");

    // Finding users excluding the current user and matching the search term
    const contacts = await User.find({
      $and: [
        { _id: { $ne: request.userId } },
        {
          $or: [
            { firstName: regex },
            { lastName: regex },
            { email: regex }
          ]
        }
      ]
    });

    return response.status(200).json({ contacts });
  } catch (err) {
    console.error("Error searching contacts:", err);
    return response.status(500).json({ message: "Unable to search contacts" });
  }
};
