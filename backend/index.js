require("dotenv").config({
	path: "./.env"
});
const express = require("express");
const cors = require('cors');
const rootRouter = require("./routes/index");

const app = express();

app.use(express.json());
app.use(cors({
	methods: ["POST", "GET"],
	credentials: true
}));

app.use("/api/v1", rootRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () =>
	  console.log(`server is running at ${PORT}`)
);