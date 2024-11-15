// HASHING PASSWORDS
async function hashingPasswordsInDB() {
  try {
    // Select all passwords
    const [passwords] = await pool.query(
      `SELECT employee_id, password FROM employee2`
    );

    // Hash each all employee's passwords
    for (let password of passwords) {
      const saltRounds = 10;

      try {
        // Generate salt and hash password
        const hashedPassword = await bcrypt.hash(password.password, saltRounds);
        console.log(
          `Original: ${password.password}, Hashed: ${hashedPassword}`
        );

        // Update the database with hashed passwords
        await pool.query(
          `UPDATE employee2 SET password = ? WHERE employee_id = ?`,
          [hashedPassword, password.employeeId]
        );
        console.log(`${password.password} was updated`);
      } catch (err) {
        console.error(`Error updating: ${password.password}`, err);
      }
    }
  } catch (error) {
    console.error("Error updating passwords:", error);
  }

  // Testing hashing of passwords - works 1 by 1
  // await pool.query(`UPDATE employee2 SET password = '$2b$10$7nERiphHAetktiJ0.BlHyOLFVHHa34bAKzkE7sNxx5L1Z2HQNNccK' WHERE employee_id = 3333;`);
}

module.exports = { hashingPasswordsInDB };
