const mysql = require("mysql2/promise");
const mssql = require("mssql");
const { mssqlConfig, mysqlPool } = require("../secrets/dbConnection");

const collectionsPerYear = [
  { year: 2005, collections: "01 + 02" },
  { year: 2006, collections: "03 + 04" },
  { year: 2007, collections: "05 + 06" },
  { year: 2008, collections: "07 + 08" },
  { year: 2009, collections: "09 + 10" },
  { year: 2010, collections: "11 + 12" },
  { year: 2011, collections: "13 + 14" },
  { year: 2012, collections: "15 + 16" },
  { year: 2013, collections: "17 + 18" },
  { year: 2014, collections: "19 + 20" },
  { year: 2015, collections: "21 + 22" },
  { year: 2016, collections: "23 + 24" },
  { year: 2017, collections: "25 + 26" },
  { year: 2018, collections: "27 + 28" },
  { year: 2019, collections: "29 + 30" },
  { year: 2020, collections: "31 + 32" },
  { year: 2021, collections: "33 + 34" },
  { year: 2022, collections: "35 + 36" },
];

const imparidadesPerYear = [
  {
    year: 2015,
    totalvalue: [
      2801, 3679, 8418, 26622, 54018, 68741, 103189, 72585, 180629, 399402,
      1041819,
    ],
  },
  {
    year: 2016,
    totalvalue: [
      1115, 1811, 5378, 15154, 27862, 45085, 77881, 51324, 113525, 242703,
      440971, 1237797,
    ],
  },
  {
    year: 2017,
    totalvalue: [
      1204, 1566, 4547, 8800, 12334, 22864, 41139, 26484, 46436, 96056, 239457,
      618337, 1791540,
    ],
  },
  {
    year: 2018,
    totalvalue: [
      358, 83, 1821, 3177, 3299, 7690, 21503, 10012, 32299, 63138, 145798,
      427575, 936618, 2018988,
    ],
  },
  {
    year: 2019,
    totalvalue: [
      165, 34, 2301, 5527, 9259, 16010, 31224, 22376, 52005, 73280, 120510,
      307001, 600356, 936643, 1971891,
    ],
  },
  {
    year: 2020,
    totalvalue: [
      64, 34, 1740, 4302, 8142, 13529, 26532, 19598, 43882, 61005, 84817,
      214717, 452106, 712740, 1327095, 2105508,
    ],
  },
  {
    year: 2021,
    totalvalue: [
      83, 16, 2005, 5729, 8810, 14844, 22752, 19942, 37931, 45405, 57641,
      138602, 309219, 435890, 884475, 886417, 1257645,
    ],
  },
  {
    year: 2022,
    totalvalue: [
      0, 16, 1231, 2945, 5180, 10105, 17128, 15204, 31037, 33769, 36241, 82456,
      140398, 154786, 303762, 233163, 498962, 3273056,
    ],
  },
  {
    year: 2023,
    totalvalue: [
      0, 16, 1231, 2945, 5180, 10105, 17128, 15204, 31037, 33769, 36241, 26311,
      63746, 54965, 104323, 61331, 197960, 1377953,
    ],
  },
];

const totalValuesPerCollection = [
    { year: 2015, values: [2801, 3679, 8418, 26622, 54018, 68741, 103189, 72585, 180629, 399402, 1041819] },
    { year: 2016, values: [1115, 1811, 5378, 15154, 27862, 45085, 77881, 51324, 113525, 242703, 440971, 1237797] },
    { year: 2017, values: [1204, 1566, 4547, 8800, 12334, 22864, 41139, 26484, 46436, 96056, 239457, 618337, 1791540] },
    { year: 2018, values: [358, 83, 1821, 3177, 3299, 7690, 21503, 10012, 32299, 63138, 145798, 427575, 936618, 2018988] },
    { year: 2019, values: [165, 34, 2301, 5527, 9259, 16010, 31224, 22376, 52005, 73280, 120510, 307001, 600356, 936643, 1971891] },
    { year: 2020, values: [64, 34, 1740, 4302, 8142, 13529, 26532, 19598, 43882, 61005, 84817, 214717, 452106, 712740, 1327095, 2105508] },
    { year: 2021, values: [83, 16, 2005, 5729, 8810, 14844, 22752, 19942, 37931, 45405, 57641, 138602, 309219, 435890, 884475, 886417, 1257645] },
    { year: 2022, values: [0, 16, 1231, 2945, 5180, 10105, 17128, 15204, 31037, 33769, 36241, 82456, 140398, 154786, 303762, 233163, 498962, 3273056] },
    { year: 2023, values: [0, 16, 1231, 2945, 5180, 10105, 17128, 15204, 31037, 33769, 36241, 26311, 63746, 54965, 104323, 61331, 197960, 1377953] }, 
]

const table = [];

totalValuesPerCollection.forEach(entry => {
    const year = entry.year;
    const values = entry.values;

    let collectionYear = 2005

    values.forEach(value => {
        table.push({
            year: year,
            collectionyear: collectionYear,
            totalvalue: value
        });

        collectionYear++;
    });
});

const insertTotalValues = async function () {
  console.log("Creating MySQL connection with config:", mysqlPool);

  const insertQuery = `
        INSERT INTO website.collectionValues 
            (year, collectionyear, totalvalue)
        VALUES (?, ?, ?)
    `;
  try {
    const connection = await mysqlPool.getConnection();
    console.log("MySQL Connection established for collectionsValues");

    for (const row of table) {
      try {
        console.log("Inserting total values row:", row); // Log each row before insertion

        const [result] = await connection.execute(insertQuery, [
          row.year ?? null,
          row.collectionyear ?? null,
          row.totalvalue ?? null
        ]);

        console.log(
          `Inserted total values for year: ${row.year}, affectedRows: ${result.affectedRows}`
        );
      } catch (insertErr) {
        console.error("Error inserting total values row into MySQL:", insertErr);
      }
    }

    console.log(
      "All total values inserted into MySQL successfully",
      insertQuery
    );
  } catch (err) {
    console.error("Error inserting total values into MySQL:", err, insertQuery);
  }
};

const transferTotalValuesPerYear = async function () {
  console.log("running transferTotalValuesPerYear");
  await insertTotalValues();
};

module.exports = { transferTotalValuesPerYear };
