const express = require('express');
const cors = require('cors');
const pool = require('./db');
const QueryStream = require('pg-query-stream')
const JSONStream = require('JSONStream')
const fs = require('fs');

const app = express();

const PORT = process.env.PORT || 3000;

//middleware
app.use(cors());//Policy
app.use(express.json()) // parsing data


//Running server
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
});
app.get("/to",async(req,res)=>{
    try {

		 await pool.connect((err, client, done) => {
			if (err) throw err;
			const query = new QueryStream(
            `	
            SELECT
        "_reference180"."_description" AS person, 
        "_reference43"."_description" AS type_stuff,
        "_reference203"."_description" AS stuff, 
        "_accumrgt16253"."_fld16210" AS quantity, 
        "_reference218"."_description" AS company, 
        "_reference183"."_description" AS place
    FROM
        "_accumrgt16253"
        INNER JOIN
        "_reference180"
        ON 
            encode( _Reference180._idrref, 'hex' ) = encode( _AccumRgT16253._Fld16202_rrref, 'hex' )
        INNER JOIN
        "_reference218"
        ON 
            "_accumrgt16253"."_fld16199rref" = "_reference218"."_idrref"
        INNER JOIN
        "_reference183"
        ON 
            "_accumrgt16253"."_fld16201rref" = "_reference183"."_idrref"
        INNER JOIN
        "_reference203"
        ON 
            "_accumrgt16253"."_fld16203rref" = "_reference203"."_idrref"
        INNER JOIN
        "_reference43"
        ON 
            "_reference203"."_idrref" = "_reference43"."_owneridrref"
    WHERE
        "_reference180"."_description" IS NOT NULL AND
        "_accumrgt16253"."_period" BETWEEN $1 AND $2 AND
        "_accumrgt16253"."_fld16210" <> 0
                    `,['2017.02.10','2017.03.10'],'utf-8'
			)
			const stream = client.query(query)
			//release the client when the stream is finished
			stream.on('end', done)
			stream.pipe(JSONStream.stringify()).pipe(res)
			
		})
		
		//res.send(anyData.row);
       // res.json(anyData.rows);
    } catch (e) {
        console.error(e.message);
    }
});

