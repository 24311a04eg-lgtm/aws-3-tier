require('dotenv').config();

const transactionService = require('./TransactionService');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const port = process.env.PORT || 4000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.get('/health', (req, res) => {

    res.status(200).json({
        status: 'ok'
    });
});

app.post('/transaction', (req, res) => {

    try {

        const { amount, desc } = req.body;

        const success =
            transactionService.addTransaction(amount, desc);

        if (success === 200) {

            return res.status(200).json({
                message: 'Transaction added successfully'
            });
        }

    } catch (err) {

        res.status(500).json({
            message: 'Something went wrong',
            error: err.message
        });
    }
});

app.get('/transaction', (req, res) => {

    try {

        transactionService.getAllTransactions(function (results) {

            const transactionList = results.map(row => ({
                id: row.id,
                amount: row.amount,
                description: row.description
            }));

            res.status(200).json({
                result: transactionList
            });
        });

    } catch (err) {

        res.status(500).json({
            message: 'Could not get transactions',
            error: err.message
        });
    }
});

app.get('/transaction/:id', (req, res) => {

    try {

        transactionService.findTransactionById(
            req.params.id,
            function (result) {

                if (result.length === 0) {

                    return res.status(404).json({
                        message: 'Transaction not found'
                    });
                }

                const transaction = result[0];

                res.status(200).json({
                    id: transaction.id,
                    amount: transaction.amount,
                    description: transaction.description
                });
            }
        );

    } catch (err) {

        res.status(500).json({
            message: 'Error retrieving transaction',
            error: err.message
        });
    }
});

app.delete('/transaction', (req, res) => {

    try {

        transactionService.deleteAllTransactions(function () {

            res.status(200).json({
                message: 'All transactions deleted'
            });
        });

    } catch (err) {

        res.status(500).json({
            message: 'Error deleting transactions',
            error: err.message
        });
    }
});

app.delete('/transaction/:id', (req, res) => {

    try {

        transactionService.deleteTransactionById(
            req.params.id,
            function () {

                res.status(200).json({
                    message:
                        `Transaction ${req.params.id} deleted`
                });
            }
        );

    } catch (err) {

        res.status(500).json({
            message: 'Error deleting transaction',
            error: err.message
        });
    }
});

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});