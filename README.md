# 🧩 Hexagon Edge Matching Puzzle Generator

This project generates **9 unique hexagon edge-matching puzzles** using the **same set of tiles** and displays them on a webpage. The generated puzzles are not meant to be played interactively on the site — instead, users can **view and download** the puzzle boards for offline solving, printing, or use in puzzle books.

Each puzzle challenges the solver to place hexagonal tiles such that **all touching edges match** in color or value.

---

## 🔧 Project Purpose

- 🔁 Reuse a fixed tile set to generate multiple distinct puzzle configurations
- 🔄 Automatically rotate and arrange tiles based on edge-matching rules
- 🧠 Apply symmetry reduction to avoid trivial duplicates
- 🖼️ Display all 9 puzzles visually on a single web page
- 📥 Allow users to download the puzzles for printing or sharing

---

## 🧪 How to Run

```bash
# Clone the repository
git clone https://github.com/ccl-iitgn/hexagon_edge_matching.git
cd hexagon_edge_matching

# Install dependencies
npm install

# Start the development server
npm run dev

# → App runs at http://localhost:5173/
