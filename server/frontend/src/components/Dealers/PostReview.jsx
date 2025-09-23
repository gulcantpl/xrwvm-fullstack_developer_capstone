import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';

const PostReview = () => {
  const [dealer, setDealer] = useState(null);
  const [review, setReview] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [carmodels, setCarmodels] = useState([]);

  const { id } = useParams();
  const dealer_url = `/djangoapp/dealer/${id}`;
  const review_url = `/djangoapp/add_review`;
  const carmodels_url = `/djangoapp/get_cars`;

  const get_dealer = async () => {
    const res = await fetch(dealer_url);
    const retobj = await res.json();

    if (retobj.status === 200 && retobj.dealer) {
      setDealer(retobj.dealer);
    }
  };

  const get_cars = async () => {
    const res = await fetch(carmodels_url);
    const retobj = await res.json();
    if (retobj.CarModels) setCarmodels(retobj.CarModels);
  };

  const postreview = async () => {
    let name =
      sessionStorage.getItem("firstname") +
      " " +
      sessionStorage.getItem("lastname");
    if (name.includes("null")) {
      name = sessionStorage.getItem("username");
    }
    if (!model || !review || !date || !year) {
      alert("All details are mandatory");
      return;
    }

    let [make_chosen, model_chosen] = model.split(" ");

    const jsoninput = JSON.stringify({
      name,
      dealership: id,
      review,
      purchase: true,
      purchase_date: date,
      car_make: make_chosen,
      car_model: model_chosen,
      car_year: year,
    });

    const res = await fetch(review_url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: jsoninput,
    });

    const json = await res.json();
    if (json.status === 200) {
      window.location.href = `/dealer/${id}`;
    }
  };

  useEffect(() => {
    get_dealer();
    get_cars();
  }, []);

  if (!dealer) {
    return (
      <div>
        <Header />
        <p>Loading dealer info...</p>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div style={{ margin: "5%" }}>
        <h1 style={{ color: "darkblue" }}>{dealer.full_name}</h1>

        <textarea
          id="review"
          cols="50"
          rows="7"
          onChange={(e) => setReview(e.target.value)}
        ></textarea>

        <div className="input_field">
          Purchase Date{" "}
          <input type="date" onChange={(e) => setDate(e.target.value)} />
        </div>

        <div className="input_field">
          Car Make{" "}
          <select
            name="cars"
            id="cars"
            onChange={(e) => setModel(e.target.value)}
          >
            <option value="" selected disabled hidden>
              Choose Car Make and Model
            </option>
            {carmodels.map((carmodel, index) => (
              <option
                key={index}
                value={carmodel.CarMake + " " + carmodel.CarModel}
              >
                {carmodel.CarMake} {carmodel.CarModel}
              </option>
            ))}
          </select>
        </div>

        <div className="input_field">
          Car Year{" "}
          <input
            type="number"
            onChange={(e) => setYear(e.target.value)}
            max={2023}
            min={2015}
          />
        </div>

        <div>
          <button className="postreview" onClick={postreview}>
            Post Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostReview;
