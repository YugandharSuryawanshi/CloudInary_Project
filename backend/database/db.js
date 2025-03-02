const pool = require('../connections/connection');

const createTable = async () => {
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS images (
                id INT AUTO_INCREMENT PRIMARY KEY,
                image_name VARCHAR(255) NOT NULL,
                image_url VARCHAR(500) NOT NULL,
                cloudinary_url VARCHAR(500) NOT NULL,
                uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await pool.query(query);
        console.log("✅ Images table is ready");
    } catch (err) {
        console.error("❌ Error creating table:", err);
    }
};

createTable();
module.exports = pool;
