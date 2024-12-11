import Account from "../models/Account.js";

export const getAllAccountsScoreboard = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "totalScore",
      order = "desc",
      search = "",
    } = req.query;

    // Sort options
    const sortOptions = { [sortBy]: order === "desc" ? -1 : 1 };

    // Fetch all accounts sorted by the chosen criteria
    const allAccounts = await Account.find({})
      .populate({
        path: "characters",
        populate: {
          path: "score",
          model: "Score",
        },
      })
      .sort(sortOptions);

    // Add static ranks to the entire sorted dataset
    const rankedAccounts = allAccounts.map((account, index) => ({
      ...account.toObject(),
      rank: index + 1, // Static rank based on full dataset
    }));

    // Apply search filter without affecting ranks
    const filteredAccounts = rankedAccounts.filter((account) =>
      account.username.toLowerCase().includes(search.toLowerCase())
    );

    // Paginate the filtered results
    const paginatedAccounts = filteredAccounts.slice(
      (page - 1) * limit,
      page * limit
    );

    // Send the paginated data along with total filtered count
    res.status(200).json({
      data: paginatedAccounts,
      total: filteredAccounts.length, // Total number of accounts after search filter
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error.message);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
};



export const getAllAccountsByCharacter = async (req, res) => {
  try {
    const { classId } = req.query; // Get classId from query parameters

    if (!classId) {
      return res.status(400).json({ error: "Class ID is required" });
    }

    // Fetch accounts where at least one character's class_id matches the given clas  0 +sId
    const accounts = await Account.find()
    .populate({
      path: "characters.character",
      model: "Character",
    })
    .populate({
      path: "characters.score",
      model: "Score",
    });
  
  const data = []
  const filteredAccounts = accounts.filter((account) =>
    account.characters.some(
      (char) =>
        char.character && 
        char.character.class_id === Number(classId) ? 
        data.push({
          account,
          char
        }):null
    )
  );
  filteredAccounts 
    res.status(200).json(data); // Send filtered accounts as JSON response
  } catch (err) {
    console.error("Error fetching accounts by class:", err.message);
    res.status(500).json({ error: "Failed to fetch accounts by class" });
  }
};


export const getAccountById = async (req, res) => {
  const { accountId } = req.params
  try {
    const accounts = await Account.findById(accountId)
    .populate({
      path: 'characters.character', // Populate the `character` field in `characters`
      model:'Character',
    })
    .populate({
      path: 'characters.score', // Populate the `score` field in `characters`
      model: 'Score',
    });

    res.status(200).json(accounts); // Send the accounts as JSON response
  } catch (err) {
    console.error('Error fetching accounts:', err.message);
    res.status(500).json({ error: 'Failed to fetch accounts' });
  }
}