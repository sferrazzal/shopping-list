import React from 'react';
import Button from 'react-bootstrap/esm/Button';

const DeleteTagsModalCheckedItemList = (props) => {
    const handleClick = (tag) => {
        props.callback(tag);
    }

    return (
        props.checkedItems.map((checkedItem) => {
            return (
                <li key={checkedItem.id} className='container list-group-item'>
                    <div className='row'>
                        <div className="col">
                            <h5 className='text-center'>{checkedItem.name}</h5>
                        </div>
                        <div className='col'>
                            {
                                checkedItem.tags.map((tag) => 
                                    (<Button 
                                        onClick={() => handleClick(tag)} 
                                        className='badge bg-success mx-1' 
                                        key={checkedItem.id + tag}>
                                            {tag}
                                    </Button>)
                                )
                            }
                        </div>
                    </div>
                </li>
            )
        })
    
    )
}

export default DeleteTagsModalCheckedItemList;