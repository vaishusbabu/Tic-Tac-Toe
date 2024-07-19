import React from 'react'

function Square(props) {
    const { data } = props
    return (
        <div className='square' {...props}>
            {data ? data : ""}
        </div>
    );
}

export default Square




















