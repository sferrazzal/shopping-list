import React from "react";

const AddItem = () => {
    return (
        <form className="row row-cols-lg-auto g-3 align-items-center">
            <div className="col-12">
                <label className="visually-hidden" for="inlineFormInputGroupUsername">Username</label>
                <div className="input-group">
                <input type="text" className="form-control" id="inlineFormInputGroupUsername" placeholder="New item"/>
                </div>
            </div>

            <div className="col-12">
                <button type="submit" className="btn btn-primary">Submit</button>
            </div>
        </form>
    )
}

export default AddItem;