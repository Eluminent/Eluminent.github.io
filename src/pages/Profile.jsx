import {useState, useEffect} from "react";
import axios from "axios";

export default function Profile () {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProfile() {
            try {
            const token = localStorage.getItem("token");

            const res = await axios.get("http://localhost:3001/profile", {
                headers: {
                Authorization: `Bearer ${token}`
                }
            });

            setData(res.data);
            } catch {
            setData("Unauthorized");
            } finally {
            setLoading(false);
            }
        }

        fetchProfile();
    }, []);

    return (
        <div>
            <h1>Profile Page</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}