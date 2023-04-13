import React, { useState, useEffect } from "react";
import axios from "axios"

const Body = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        axios
            .get("http://localhost:4000")
            .then((response) => {
				console.log(response);
                setData(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

	console.log(data);
    return (
        <div>
            {data && (
                <div>
                    <h2>Response Data:</h2>
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default Body;
