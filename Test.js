import { Fragment, useEffect, useState } from 'react';
import './App.css';
import Board from './Components/Board';
import 'bootstrap/dist/css/bootstrap.min.css';
import Square from './Components/Square';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';


const createEmptyBoard = (size) => new Array(size * size).fill(null);

const useToggle = (initial = false) => {
    const [modal, setModal] = useState(initial)
    const toggle = () => setModal(prevState => !prevState)
    return [modal, toggle, setModal]
}

// const useInputChange = (initial = {}) => {
//     const [data, setData] = useState(initial)
//     const onChange = (e) => {
//         const { name, value } = e.target.value
//         setData(prevState => ({ ...prevState, [name]: value }))
//     }
//     return [data, onChange, setData]
// }

const getWinningCombinations = (size) => {
    if (!size) return [];
    const totalCells = size ** 2;
    const cells = Array.from({ length: totalCells }, (_, i) => i);

    const rows = [];
    const columns = Array.from({ length: size }, () => []);
    const diagonals = [[], []];

    for (let i = 0; i < size; i++) {
        rows.push(cells.slice(i * size, i * size + size));
        for (let j = 0; j < size; j++) {
            columns[j].push(cells[i * size + j]);
        }
        diagonals[0].push(cells[i * size + i]);
        diagonals[1].push(cells[i * size + (size - 1 - i)]);
    }

    return [...rows, ...columns, ...diagonals];
};

function App() {
    const [boardSize, setBoardSize] = useState("");
    const [squares, setSquares] = useState([]);
    const [winner, setWinner] = useState(null);
    const [modal, toggle] = useToggle(false)
    const [modalDelete, toggleDelete] = useToggle(false)

    const size = Math.sqrt(squares.length);
    const winningCombinations = getWinningCombinations(size);
    const isComputerTurn = squares.filter(square => square !== null).length % 2 !== 0;

    useEffect(() => {
        if (checkWinner("x")) {
            setWinner('x');
        } else if (checkWinner("o")) {
            setWinner('o');
        } else if (isComputerTurn) {
            const emptyIndices = squares.map((square, index) => square === null ? index : null).filter(index => index !== null);
            const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
            setTimeout(() => placeMarker(randomIndex, 'o'), 1000);
        }
    }, [squares]);

    const checkWinner = (player) => {
        return winningCombinations.some(combination =>
            combination.every(index => squares[index] === player)
        );
    };

    const placeMarker = (index, marker) => {
        setSquares(prevSquares => {
            const newSquares = [...prevSquares];
            newSquares[index] = marker;
            return newSquares;
        });
    };

    const handleSquareClick = (index) => {
        if (!squares[index] && !winner && !isComputerTurn) {
            placeMarker(index, 'x');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const size = parseInt(boardSize);
        if (size < 3 || size > 10) {
            alert("Please enter a limit between 3-10");
            return;
        }
        setSquares(createEmptyBoard(size));
        setWinner(null);
        setBoardSize("");
    };

    return (
        <>
            <StatusModal {...{ modal, toggle }} />
            <StatusModal modal={modalDelete} toggle={toggleDelete} title="delete" />
            {/* <Button onClick={toggle}>Click</Button>
            <Button onClick={toggleDelete}>Click</Button> */}
            <div className='main'>
                <header className="header">
                    <span>T</span><span>I</span><span>C</span>
                    <span>T</span><span>A</span><span>C</span>
                    <span>T</span><span>O</span><span>E</span>
                </header>
                <div className="d-flex">
                    <form className="d-flex align-items-center" onSubmit={handleSubmit}>
                        <div className="flex-grow-1 me-2">
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Enter limit"
                                min={3}
                                max={10}
                                value={boardSize}
                                onChange={e => setBoardSize(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-outline-secondary">Submit</button>
                    </form>
                </div>
                {squares.length > 0 && (
                    <Board style={{ width: `${size * 100}px`, height: `${size * 100}px` }}>
                        {squares.map((square, index) => (
                            <Square
                                key={index}
                                data={square}
                                onClick={() => handleSquareClick(index)}
                            />
                        ))}
                    </Board>
                )}
                {winner && (
                    <div className={`result ${winner === 'x' ? 'green' : 'red'}`}>
                        {/* {winner === 'x' ? (
                        
                    ) : (
                        <div className="modal" tabIndex="-1">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">You lost</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <p>Modal body text goes here.</p>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button type="button" className="btn btn-primary">Save changes</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )} */}
                    </div>
                )}

            </div >
        </>
    );
}

export default App;


const StatusModal = ({ modal, toggle, title = "default", ...args }) => {
    return (

        <Modal isOpen={modal} toggle={toggle} {...args}>
            <ModalHeader toggle={toggle}>Modal {title}</ModalHeader>
            <ModalBody>

            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={toggle}>
                    Play Again
                </Button>{' '}
                <Button color="secondary" onClick={toggle}>
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>


    )
}


// import { Fragment, useEffect, useState } from 'react';
// import './App.css';
// import Board from './Components/Board';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import Square from './Components/Square';
// import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';


// const createEmptyBoard = (size) => new Array(size * size).fill(null);

// const useToggle = (initial = false) => {
//     const [modal, setModal] = useState(initial)
//     const toggle = () => setModal(prevState => !prevState)
//     return [modal, toggle, setModal]
// }

// // const useInputChange = (initial = {}) => {
// //     const [data, setData] = useState(initial)
// //     const onChange = (e) => {
// //         const { name, value } = e.target.value
// //         setData(prevState => ({ ...prevState, [name]: value }))
// //     }
// //     return [data, onChange, setData]
// // }

// const getWinningCombinations = (size) => {
//     if (!size) return [];
//     const totalCells = size ** 2;
//     const cells = Array.from({ length: totalCells }, (_, i) => i);

//     const rows = [];
//     const columns = Array.from({ length: size }, () => []);
//     const diagonals = [[], []];

//     for (let i = 0; i < size; i++) {
//         rows.push(cells.slice(i * size, i * size + size));
//         for (let j = 0; j < size; j++) {
//             columns[j].push(cells[i * size + j]);
//         }
//         diagonals[0].push(cells[i * size + i]);
//         diagonals[1].push(cells[i * size + (size - 1 - i)]);
//     }

//     return [...rows, ...columns, ...diagonals];
// };

// function App() {
//     const [boardSize, setBoardSize] = useState("");
//     const [squares, setSquares] = useState([]);
//     const [winner, setWinner] = useState(null);
//     const [modal, toggle] = useToggle(false)
//     const [modalDelete, toggleDelete] = useToggle(false)

//     const size = Math.sqrt(squares.length);
//     const winningCombinations = getWinningCombinations(size);
//     const isComputerTurn = squares.filter(square => square !== null).length % 2 !== 0;

//     useEffect(() => {
//         if (checkWinner("x")) {
//             setWinner('x');
//         } else if (checkWinner("o")) {
//             setWinner('o');
//         } else if (isComputerTurn) {
//             const emptyIndices = squares.map((square, index) => square === null ? index : null).filter(index => index !== null);
//             const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
//             setTimeout(() => placeMarker(randomIndex, 'o'), 1000);
//         }
//     }, [squares]);

//     const checkWinner = (player) => {
//         return winningCombinations.some(combination =>
//             combination.every(index => squares[index] === player)
//         );
//     };

//     const placeMarker = (index, marker) => {
//         setSquares(prevSquares => {
//             const newSquares = [...prevSquares];
//             newSquares[index] = marker;
//             return newSquares;
//         });
//     };

//     const handleSquareClick = (index) => {
//         if (!squares[index] && !winner && !isComputerTurn) {
//             placeMarker(index, 'x');
//         }
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         const size = parseInt(boardSize);
//         if (size < 3 || size > 10) {
//             alert("Please enter a limit between 3-10");
//             return;
//         }
//         setSquares(createEmptyBoard(size));
//         setWinner(null);
//         setBoardSize("");
//     };

//     return (
//         <>
//             <StatusModal {...{ modal, toggle }} />
//             <StatusModal modal={modalDelete} toggle={toggleDelete} title="delete" />
//             {/* <Button onClick={toggle}>Click</Button>
//             <Button onClick={toggleDelete}>Click</Button> */}
//             <div className='main'>
//                 <header className="header">
//                     <span>T</span><span>I</span><span>C</span>
//                     <span>T</span><span>A</span><span>C</span>
//                     <span>T</span><span>O</span><span>E</span>
//                 </header>
//                 <div className="d-flex">
//                     <form className="d-flex align-items-center" onSubmit={handleSubmit}>
//                         <div className="flex-grow-1 me-2">
//                             <input
//                                 type="number"
//                                 className="form-control"
//                                 placeholder="Enter limit"
//                                 min={3}
//                                 max={10}
//                                 value={boardSize}
//                                 onChange={e => setBoardSize(e.target.value)}
//                             />
//                         </div>
//                         <button type="submit" className="btn btn-outline-secondary">Submit</button>
//                     </form>
//                 </div>
//                 {squares.length > 0 && (
//                     <Board style={{ width: `${size * 100}px`, height: `${size * 100}px` }}>
//                         {squares.map((square, index) => (
//                             <Square
//                                 key={index}
//                                 data={square}
//                                 onClick={() => handleSquareClick(index)}
//                             />
//                         ))}
//                     </Board>
//                 )}
//                 {winner && (
//                     <div className={`result ${winner === 'x' ? 'green' : 'red'}`}>
//                         {/* {winner === 'x' ? (

//                     ) : (
//                         <div className="modal" tabIndex="-1">
//                             <div className="modal-dialog">
//                                 <div className="modal-content">
//                                     <div className="modal-header">
//                                         <h5 className="modal-title">You lost</h5>
//                                         <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//                                     </div>
//                                     <div className="modal-body">
//                                         <p>Modal body text goes here.</p>
//                                     </div>
//                                     <div className="modal-footer">
//                                         <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
//                                         <button type="button" className="btn btn-primary">Save changes</button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     )} */}
//                     </div>
//                 )}

//             </div >
//         </>
//     );
// }

// export default App;

