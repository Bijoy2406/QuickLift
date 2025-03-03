// Update User Profile
router.put('/profile', async (req, res) => {
  const { name, email, password, preferred_location, car_number, car_details } = req.body;
  const user_id = req.user.user_id;

  try {
    // Check if the user exists
    const sql = "SELECT * FROM users WHERE id = ?";
    db.query(sql, [user_id], async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (result.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      let updateSql = "UPDATE users SET name = ?, email = ? WHERE id = ?";
      let updateValues = [name, email, user_id];

      // If the user is updating their password
      if (password) {
        // Ensure the new password is hashed
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update SQL query to include password update
        updateSql = "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?";
        updateValues = [name, email, hashedPassword, user_id];
      }

      // Update user information
      db.query(updateSql, updateValues, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Error updating user profile' });
        }

        // If the user is a rider, update the rider's details
        if (result[0].role === 'rider') {
          const riderSql = "UPDATE riders SET car_number = ?, car_details = ? WHERE user_id = ?";
          const riderValues = [car_number, car_details, user_id];

          db.query(riderSql, riderValues, (err) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ error: 'Error updating rider details' });
            }
          });
        } else if (result[0].role === 'user') {
          // If the user is a regular user, update the preferred_location
          const userSql = "UPDATE users SET preferred_location = ? WHERE id = ?";
          const userValues = [preferred_location, user_id];

          db.query(userSql, userValues, (err) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ error: 'Error updating user location' });
            }
          });
        }

        res.status(200).json({ message: 'Profile updated successfully' });
      });
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Server error" });
  }
});
