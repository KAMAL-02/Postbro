import axios from 'axios';
import { Request, Response } from 'express';

const sendApiRequest = async(req: Request, res: Response) => {
    console.log("Request body is: ", req.body);
    const { method, url } = req.body;
    if (!url || !method) {
        res.status(400).json({ message: 'All fields are required' });
        return ;
    }
    try {
        const response = await axios({method, url});
        if(!response) {
            res.status(404).json({ message: 'Not found' });
            return ;
        }
        res.status(200).json({ status: response.status, data: response.data });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
}

export { sendApiRequest };