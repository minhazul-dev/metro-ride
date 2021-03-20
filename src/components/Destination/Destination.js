import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';

const Destination = () => {
    const {id}= useParams();
    const [details, setDetails]= useState([]);
    useEffect(() =>{
        const url=`http://www.json-generator.com/api/json/get/caDMRPLgUi?indent=2`
        fetch(url)
        .then(response => response.json())
        .then((data) =>setDetails(data));
    },[]);
   
    return (
        <div className="row">
            <div className="col-md-6">  
           <input  type="text" placeholder="from"/>
          <br/> 
          <br/> 
          <input type="text" placeholder="to"/>
          <br/> 
          <br/> 
          <button>search</button>
          </div>
          <div className="col-md-6">
              <h3>this is for map</h3>
          </div>
        </div>
    );
};

export default Destination;  