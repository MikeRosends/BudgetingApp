const mysql = require("mysql2/promise");
const mssql = require("mssql");
const { mssqlConfig, mysqlPool } = require("../secrets/dbConnection");

const fetchOriginalData = async function () {
    console.log('running fetchOriginalData');
    
    const query = `
       SELECT
            ms.AutoCode,
            a.Referencia,
            ms.CodArtigo,
            ms.Armazem,
            ms.Data,
            ms.Quantidade,
            ac.Campo1 AS PrecoCusto, -- Replacing PrecoCusto with Campo1
            a.Coleccao,
            (ms.Quantidade * ac.Campo1) AS TotalValue, -- Calculating TotalValue with Campo1
            tm.EntradaSaida,
            tm.CodTipo
        FROM BO_BLUE.[dbo].tMovimentosStock ms WITH (NOLOCK)
        INNER JOIN BO_BLUE.[dbo].tTiposMovimentos tm
            WITH (NOLOCK) ON ms.CodTipo = tm.CodTipo
        LEFT JOIN BO_BLUE.[dbo].tArtigosCT ac
            WITH (NOLOCK) ON ac.codbarras = ms.CodArtigo 
            LEFT JOIN BO_BLUE.[dbo].[tArtigos] a
            WITH (NOLOCK) ON ac.referencia = a.Referencia-- Joining with tArtigosCT based on Referencia

        WHERE ms.Deleted = 0 AND ac.Campo1 IS NOT NULL
        AND ms.Data >= '2024-10-01'
        GROUP BY 
            ms.AutoCode,
            ms.CodArtigo, 
            ms.Armazem, 
            ms.Data, 
            ms.Quantidade, 
            a.Referencia, 
            ac.Campo1, -- Grouping by Campo1 (new field)
            a.Coleccao,
            tm.EntradaSaida,
            tm.CodTipo
    `;

    try {
        const mssqlConnection = await mssql.connect(mssqlConfig);
        const result = await mssqlConnection.request().query(query);
        return result.recordset;
    } catch (err) {
        console.error('Error fetching data from MSSQL', err);
    }
};

// column names are not updated
const insertDataIntoNewTable = async function (data) {
    console.log('Creating MySQL connection with config:', mysqlPool);
    
    const insertQuery = `
        INSERT INTO website.tmovimentosstockv2 
            (id, codartigo, armazem, data, quantidade, referencia, precocusto, colecao, totalvalue, entradasaida, codtipo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    try {
        const connection = await mysqlPool.getConnection();
        console.log('MySQL Connection established');

         for (const row of data) {
            try {
                console.log('Inserting row:', row);  // Log each row before insertion

                const [result] = await connection.execute(insertQuery, [
                    row.AutoCode ?? null,
                    row.CodArtigo ?? null,
                    row.Armazem ?? null,
                    row.Data ?? null,
                    row.Quantidade ?? null,
                    row.Referencia ?? null,
                    row.PrecoCusto ?? null, // PrecoCusto
                    row.Coleccao ?? null,
                    row.TotalValue ?? null,
                    row.EntradaSaida ?? null,
                    row.CodTipo ?? null
                ]);

                console.log(`Inserted row: ${row.AutoCode}, affectedRows: ${result.affectedRows}`);
                
            } catch (insertErr) {
                console.error('Error inserting row into MySQL:', insertErr);
            }
        }

        console.log('Data inserted into MySQL successfully', insertQuery);
        
    } catch (err) {
        console.error('Error inserting data into MySQL:', err, insertQuery);
    }
};

const transferData = async function() {
    console.log('running transferData');
    
    const data = await fetchOriginalData();
    if (data && data.length > 0) {
        await insertDataIntoNewTable(data);  // Pass the fetched data here
    } else {
        console.log('No data to transfer found');
    }
};

module.exports = { transferData };
