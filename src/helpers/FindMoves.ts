import type { BoardSpace, Piece } from './GenerateChessBoard'

const files = new Map([
  ['a', 1],
  ['b', 2],
  ['c', 3],
  ['d', 4],
  ['e', 5],
  ['f', 6],
  ['g', 7],
  ['h', 8]
])

const fileNumbers = new Map([
  [1, 'a'],
  [2, 'b'],
  [3, 'c'],
  [4, 'd'],
  [5, 'e'],
  [6, 'f'],
  [7, 'g'],
  [8, 'h']
])

export function getMovableSpaces(
  piece: Piece,
  piecesList: Piece[],
  enPassantPiece: Piece
): BoardSpace[] {
  const pieceType = piece.piece.replace('white', '').replace('black', '')
  switch (pieceType) {
    case 'Pawn':
      return getPawnMoves(piece, piecesList, enPassantPiece)
    case 'Knight':
      return getKnightMoves(piece, piecesList, true, enPassantPiece)
    case 'Bishop':
      return getBishopMoves(piece, piecesList, true, enPassantPiece)
    case 'Rook':
      return getRookMoves(piece, piecesList, true, enPassantPiece)
    case 'Queen':
      return getBishopMoves(piece, piecesList, true, enPassantPiece).concat(
        getRookMoves(piece, piecesList, true, enPassantPiece)
      )
    case 'King':
      return getKingMoves(piece, piecesList, enPassantPiece)
  }

  return []
}

function getMovableSpacesNoCheckTest(
  piece: Piece,
  piecesList: Piece[],
  enPassantPiece: Piece
): BoardSpace[] {
  const pieceType = piece.piece.replace('white', '').replace('black', '')
  switch (pieceType) {
    case 'Pawn':
      return getPawnMoves(piece, piecesList, enPassantPiece)
    case 'Knight':
      return getKnightMoves(piece, piecesList, false, enPassantPiece)
    case 'Bishop':
      return getBishopMoves(piece, piecesList, false, enPassantPiece)
    case 'Rook':
      return getRookMoves(piece, piecesList, false, enPassantPiece)
    case 'Queen':
      return getBishopMoves(piece, piecesList, false, enPassantPiece).concat(
        getRookMoves(piece, piecesList, false, enPassantPiece)
      )
    case 'King':
      return getKingMoves(piece, piecesList, enPassantPiece)
  }

  return []
}

function findPieceOnSpace(file: string, rank: number, piecesList: Piece[]): string {
  const result = piecesList.filter(
    (boardPiece) =>
      boardPiece.spaceName.charAt(0) === file && parseInt(boardPiece.spaceName.charAt(1)) === rank
  )
  if (result.length > 0) {
    return result[0].piece.includes('white') ? 'white' : 'black'
  }

  return ''
}

function getPiecesAfterMove(oldSpace: BoardSpace, newSpace: BoardSpace, piecesList: Piece[]) {
  const returnArray = []
  for (const piece of piecesList) {
    returnArray.push({ spaceName: piece.spaceName, piece: piece.piece })
  }
  for (let i = 0; i < returnArray.length; i++) {
    if (
      returnArray[i].spaceName.charAt(0) === newSpace.file &&
      returnArray[i].spaceName.charAt(1) === newSpace.rank
    ) {
      returnArray.splice(i, 1)
      break
    }
  }
  for (const boardPiece of returnArray) {
    if (
      boardPiece.spaceName.charAt(0) === oldSpace.file &&
      boardPiece.spaceName.charAt(1) === oldSpace.rank
    ) {
      boardPiece.spaceName = newSpace.file + newSpace.rank
    }
  }
  return returnArray
}

export function getKing(piecesList: Piece[], color: string) {
  for (const piece of piecesList) {
    if (piece.piece === color + 'King') {
      return piece
    }
  }
}

function checkMovesKingNotInCheck(
  movableSpaces: BoardSpace[],
  piece: Piece,
  piecesList: Piece[],
  enPassantPiece: Piece
) {
  const color = piece.piece.includes('white') ? 'white' : 'black'
  for (let i = 0; i < movableSpaces.length; i++) {
    if (
      isKingChecked(
        getKing(piecesList, color)!,
        getPiecesAfterMove(
          { rank: piece.spaceName.charAt(1), file: piece.spaceName.charAt(0) },
          { rank: movableSpaces[i].rank, file: movableSpaces[i].file },
          piecesList
        ),
        enPassantPiece
      )
    ) {
      movableSpaces.splice(i, 1)
      i--
    }
  }
}

function getPawnMoves(piece: Piece, piecesList: Piece[], enPassantPiece: Piece): BoardSpace[] {
  const movableSpaces: BoardSpace[] = []
  const file = piece.spaceName.charAt(0)
  const rank = parseInt(piece.spaceName.charAt(1))
  const oppositeColor = piece.piece.includes('white') ? 'black' : 'white'
  const direction = piece.piece.includes('white') ? 1 : -1
  const startRank = piece.piece.includes('white') ? 2 : 7
  const enPassantFile =
    enPassantPiece.piece !== undefined ? enPassantPiece.spaceName.charAt(0) : undefined
  const enPassantRank =
    enPassantPiece.piece !== undefined ? parseInt(enPassantPiece.spaceName.charAt(1)) : undefined
  // Move 2 spaces
  if (parseInt(piece.spaceName.charAt(1)) === startRank) {
    if (
      findPieceOnSpace(file, rank + 1 * direction, piecesList) === '' &&
      findPieceOnSpace(file, rank + 2 * direction, piecesList) === ''
    ) {
      movableSpaces.push({ rank: (rank + 2 * direction).toString(), file: file })
    }
  }
  // Move 1 space
  if (findPieceOnSpace(file, rank + 1 * direction, piecesList) === '') {
    movableSpaces.push({ rank: (rank + 1 * direction).toString(), file: file })
  }

  // Take left
  if (
    findPieceOnSpace(fileNumbers.get(files.get(file)! - 1)!, rank + 1 * direction, piecesList) ===
    oppositeColor
  ) {
    movableSpaces.push({
      rank: (rank + 1 * direction).toString(),
      file: fileNumbers.get(files.get(file)! - 1)!
    })
  }

  // Take right
  if (
    findPieceOnSpace(fileNumbers.get(files.get(file)! + 1)!, rank + 1 * direction, piecesList) ===
    oppositeColor
  ) {
    movableSpaces.push({
      rank: (rank + 1 * direction).toString(),
      file: fileNumbers.get(files.get(file)! + 1)!
    })
  }

  // En passant
  if (
    enPassantFile !== undefined &&
    (fileNumbers.get(files.get(file)! + 1)! === enPassantFile ||
      fileNumbers.get(files.get(file)! - 1)! === enPassantFile) &&
    rank === enPassantRank!
  ) {
    movableSpaces.push({
      rank: (rank + 1 * direction).toString(),
      file: fileNumbers.get(files.get(file)! + (files.get(enPassantFile)! - files.get(file)!))!
    })
  }

  checkMovesKingNotInCheck(movableSpaces, piece, piecesList, enPassantPiece)

  return movableSpaces
}

function getPawnTakes(piece: Piece, piecesList: Piece[]): BoardSpace[] {
  const movableSpaces: BoardSpace[] = []
  const file = piece.spaceName.charAt(0)
  const rank = parseInt(piece.spaceName.charAt(1))
  const color = piece.piece.includes('white') ? 'white' : 'black'
  const direction = piece.piece.includes('white') ? 1 : -1

  // Take left
  if (
    findPieceOnSpace(fileNumbers.get(files.get(file)! - 1)!, rank + 1 * direction, piecesList) !==
    color
  ) {
    movableSpaces.push({
      rank: (rank + 1 * direction).toString(),
      file: fileNumbers.get(files.get(file)! - 1)!
    })
  }
  // Take right
  if (
    findPieceOnSpace(fileNumbers.get(files.get(file)! + 1)!, rank + 1 * direction, piecesList) !==
    color
  ) {
    movableSpaces.push({
      rank: (rank + 1 * direction).toString(),
      file: fileNumbers.get(files.get(file)! + 1)!
    })
  }

  return movableSpaces
}

function getKnightMoves(
  piece: Piece,
  piecesList: Piece[],
  testingCheck: boolean,
  enPassantPiece: Piece
): BoardSpace[] {
  const movableSpaces: BoardSpace[] = []
  const file = piece.spaceName.charAt(0)
  const rank = parseInt(piece.spaceName.charAt(1))
  const color = piece.piece.includes('white') ? 'white' : 'black'
  // Up 2 left 1
  if (files.get(file)! >= 1 && rank + 2 < 8) {
    if (findPieceOnSpace(fileNumbers.get(files.get(file)! - 1)!, rank + 2, piecesList) !== color) {
      movableSpaces.push({
        rank: (rank + 2).toString(),
        file: fileNumbers.get(files.get(file)! - 1)!.toString()
      })
    }
  }
  // Up 2 right 1
  if (files.get(file)! <= 8 && rank + 2 < 8) {
    if (findPieceOnSpace(fileNumbers.get(files.get(file)! + 1)!, rank + 2, piecesList) !== color) {
      movableSpaces.push({
        rank: (rank + 2).toString(),
        file: fileNumbers.get(files.get(file)! + 1)!.toString()
      })
    }
  }
  // Down 2 left 1
  if (files.get(file)! >= 1 && rank - 2 >= 1) {
    if (findPieceOnSpace(fileNumbers.get(files.get(file)! - 1)!, rank - 2, piecesList) !== color) {
      movableSpaces.push({
        rank: (rank - 2).toString(),
        file: fileNumbers.get(files.get(file)! - 1)!.toString()
      })
    }
  }
  // Down 2 right 1
  if (files.get(file)! <= 8 && rank - 2 >= 1) {
    if (findPieceOnSpace(fileNumbers.get(files.get(file)! + 1)!, rank - 2, piecesList) !== color) {
      movableSpaces.push({
        rank: (rank - 2).toString(),
        file: fileNumbers.get(files.get(file)! + 1)!.toString()
      })
    }
  }
  // Left 2 up 1
  if (files.get(file)! >= 3 && rank + 1 <= 8) {
    if (findPieceOnSpace(fileNumbers.get(files.get(file)! - 2)!, rank + 1, piecesList) !== color) {
      movableSpaces.push({
        rank: (rank + 1).toString(),
        file: fileNumbers.get(files.get(file)! - 2)!.toString()
      })
    }
  }
  // Left 2 down 1
  if (files.get(file)! >= 3 && rank - 1 >= 1) {
    if (findPieceOnSpace(fileNumbers.get(files.get(file)! - 2)!, rank - 1, piecesList) !== color) {
      movableSpaces.push({
        rank: (rank - 1).toString(),
        file: fileNumbers.get(files.get(file)! - 2)!.toString()
      })
    }
  }
  // Right 2 up 1
  if (files.get(file)! <= 6 && rank + 1 <= 8) {
    if (findPieceOnSpace(fileNumbers.get(files.get(file)! + 2)!, rank + 1, piecesList) !== color) {
      movableSpaces.push({
        rank: (rank + 1).toString(),
        file: fileNumbers.get(files.get(file)! + 2)!.toString()
      })
    }
  }
  // Right 2 down 1
  if (files.get(file)! <= 6 && rank - 1 >= 1) {
    if (findPieceOnSpace(fileNumbers.get(files.get(file)! + 2)!, rank - 1, piecesList) !== color) {
      movableSpaces.push({
        rank: (rank - 1).toString(),
        file: fileNumbers.get(files.get(file)! + 2)!.toString()
      })
    }
  }
  if (testingCheck) {
    checkMovesKingNotInCheck(movableSpaces, piece, piecesList, enPassantPiece)
  }

  return movableSpaces
}

function getBishopMoves(
  piece: Piece,
  piecesList: Piece[],
  testingCheck: boolean,
  enPassantPiece: Piece
): BoardSpace[] {
  const movableSpaces: BoardSpace[] = []
  const file = piece.spaceName.charAt(0)
  const rank = parseInt(piece.spaceName.charAt(1))
  const color = piece.piece.includes('white') ? 'white' : 'black'
  const oppositeColor = piece.piece.includes('white') ? 'black' : 'white'
  // Top left
  let currentRank = file === 'a' ? rank : rank + 1
  let currentFile = file === 'a' ? file : fileNumbers.get(files.get(file)! - 1)!
  while (
    findPieceOnSpace(fileNumbers.get(files.get(currentFile)!)!, currentRank, piecesList) !== color
  ) {
    const pieceHit =
      findPieceOnSpace(fileNumbers.get(files.get(currentFile)!)!, currentRank, piecesList) ===
      oppositeColor
    movableSpaces.push({
      rank: currentRank.toString(),
      file: fileNumbers.get(files.get(currentFile)!)!.toString()
    })
    if (currentRank + 1 > 8 || currentFile === 'a' || pieceHit) {
      break
    }
    currentRank++
    currentFile = fileNumbers.get(files.get(currentFile)! - 1)!
  }
  // Top right
  currentRank = file === 'h' ? rank : rank + 1
  currentFile = file === 'h' ? file : fileNumbers.get(files.get(file)! + 1)!
  while (
    findPieceOnSpace(fileNumbers.get(files.get(currentFile)!)!, currentRank, piecesList) !== color
  ) {
    const pieceHit =
      findPieceOnSpace(fileNumbers.get(files.get(currentFile)!)!, currentRank, piecesList) ===
      oppositeColor
    movableSpaces.push({
      rank: currentRank.toString(),
      file: fileNumbers.get(files.get(currentFile)!)!.toString()
    })
    if (currentRank + 1 > 8 || currentFile === 'h' || pieceHit) {
      break
    }
    currentRank++
    currentFile = fileNumbers.get(files.get(currentFile)! + 1)!
  }
  // Bottom left
  currentRank = file === 'a' ? rank : rank - 1
  currentFile = file === 'a' ? file : fileNumbers.get(files.get(file)! - 1)!
  while (
    findPieceOnSpace(fileNumbers.get(files.get(currentFile)!)!, currentRank, piecesList) !== color
  ) {
    const pieceHit =
      findPieceOnSpace(fileNumbers.get(files.get(currentFile)!)!, currentRank, piecesList) ===
      oppositeColor
    movableSpaces.push({
      rank: currentRank.toString(),
      file: fileNumbers.get(files.get(currentFile)!)!.toString()
    })
    if (currentRank - 1 < 1 || currentFile === 'a' || pieceHit) {
      break
    }
    currentRank--
    currentFile = fileNumbers.get(files.get(currentFile)! - 1)!
  }
  // Bottom right
  currentRank = file === 'h' ? rank : rank - 1
  currentFile = file === 'h' ? file : fileNumbers.get(files.get(file)! + 1)!
  while (
    findPieceOnSpace(fileNumbers.get(files.get(currentFile)!)!, currentRank, piecesList) !== color
  ) {
    const pieceHit =
      findPieceOnSpace(fileNumbers.get(files.get(currentFile)!)!, currentRank, piecesList) ===
      oppositeColor
    movableSpaces.push({
      rank: currentRank.toString(),
      file: fileNumbers.get(files.get(currentFile)!)!.toString()
    })
    if (currentRank - 1 < 1 || currentFile === 'h' || pieceHit) {
      break
    }
    currentRank--
    currentFile = fileNumbers.get(files.get(currentFile)! + 1)!
  }
  if (testingCheck) {
    checkMovesKingNotInCheck(movableSpaces, piece, piecesList, enPassantPiece)
  }

  return movableSpaces
}

function getRookMoves(
  piece: Piece,
  piecesList: Piece[],
  testingCheck: boolean,
  enPassantPiece: Piece
): BoardSpace[] {
  const movableSpaces: BoardSpace[] = []
  const file = piece.spaceName.charAt(0)
  const rank = parseInt(piece.spaceName.charAt(1))
  const color = piece.piece.includes('white') ? 'white' : 'black'
  const oppositeColor = piece.piece.includes('white') ? 'black' : 'white'

  // Get up
  let currentRank = rank + 1
  let currentFile = file
  while (
    findPieceOnSpace(fileNumbers.get(files.get(currentFile)!)!, currentRank, piecesList) !== color
  ) {
    const pieceHit =
      findPieceOnSpace(fileNumbers.get(files.get(currentFile)!)!, currentRank, piecesList) ===
      oppositeColor
    movableSpaces.push({
      rank: currentRank.toString(),
      file: fileNumbers.get(files.get(currentFile)!)!.toString()
    })
    if (currentRank + 1 > 8 || pieceHit) {
      break
    }
    currentRank++
  }

  // Get down
  currentRank = rank - 1
  currentFile = file
  while (
    findPieceOnSpace(fileNumbers.get(files.get(currentFile)!)!, currentRank, piecesList) !== color
  ) {
    const pieceHit =
      findPieceOnSpace(fileNumbers.get(files.get(currentFile)!)!, currentRank, piecesList) ===
      oppositeColor
    movableSpaces.push({
      rank: currentRank.toString(),
      file: fileNumbers.get(files.get(currentFile)!)!.toString()
    })
    if (currentRank - 1 < 1 || pieceHit) {
      break
    }
    currentRank--
  }

  // Get left
  currentRank = rank
  currentFile = file === 'a' ? file : fileNumbers.get(files.get(file)! - 1)!
  while (
    findPieceOnSpace(fileNumbers.get(files.get(currentFile)!)!, currentRank, piecesList) !== color
  ) {
    const pieceHit =
      findPieceOnSpace(fileNumbers.get(files.get(currentFile)!)!, currentRank, piecesList) ===
      oppositeColor
    movableSpaces.push({
      rank: currentRank.toString(),
      file: fileNumbers.get(files.get(currentFile)!)!.toString()
    })
    if (currentFile === 'a' || pieceHit) {
      break
    }
    currentFile = fileNumbers.get(files.get(currentFile)! - 1)!
  }

  // Get right
  currentRank = rank
  currentFile = file === 'h' ? file : fileNumbers.get(files.get(file)! + 1)!
  while (
    findPieceOnSpace(fileNumbers.get(files.get(currentFile)!)!, currentRank, piecesList) !== color
  ) {
    const pieceHit =
      findPieceOnSpace(fileNumbers.get(files.get(currentFile)!)!, currentRank, piecesList) ===
      oppositeColor
    movableSpaces.push({
      rank: currentRank.toString(),
      file: fileNumbers.get(files.get(currentFile)!)!.toString()
    })
    if (currentFile === 'h' || pieceHit) {
      break
    }
    currentFile = fileNumbers.get(files.get(currentFile)! + 1)!
  }
  if (testingCheck) {
    checkMovesKingNotInCheck(movableSpaces, piece, piecesList, enPassantPiece)
  }

  return movableSpaces
}

function getKingMoves(piece: Piece, piecesList: Piece[], enPassantPiece: Piece): BoardSpace[] {
  let movableSpaces: BoardSpace[] = []
  const file = piece.spaceName.charAt(0)
  const rank = parseInt(piece.spaceName.charAt(1))
  const color = piece.piece.includes('white') ? 'white' : 'black'
  const oppositeColor = piece.piece.includes('white') ? 'black' : 'white'

  // Top left
  if (
    !findPieceOnSpace(fileNumbers.get(files.get(file)! - 1)!, rank + 1, piecesList).includes(color)
  ) {
    movableSpaces.push({
      rank: (rank + 1).toString(),
      file: fileNumbers.get(files.get(file)! - 1)!
    })
  }

  // Top middle
  if (!findPieceOnSpace(file, rank + 1, piecesList).includes(color)) {
    movableSpaces.push({
      rank: (rank + 1).toString(),
      file: file
    })
  }

  // Top right
  if (
    !findPieceOnSpace(fileNumbers.get(files.get(file)! + 1)!, rank + 1, piecesList).includes(color)
  ) {
    movableSpaces.push({
      rank: (rank + 1).toString(),
      file: fileNumbers.get(files.get(file)! + 1)!
    })
  }

  // Left
  if (!findPieceOnSpace(fileNumbers.get(files.get(file)! - 1)!, rank, piecesList).includes(color)) {
    movableSpaces.push({
      rank: rank.toString(),
      file: fileNumbers.get(files.get(file)! - 1)!
    })
  }

  // Right
  if (!findPieceOnSpace(fileNumbers.get(files.get(file)! + 1)!, rank, piecesList).includes(color)) {
    movableSpaces.push({
      rank: rank.toString(),
      file: fileNumbers.get(files.get(file)! + 1)!
    })
  }

  // Bottom left
  if (
    !findPieceOnSpace(fileNumbers.get(files.get(file)! - 1)!, rank - 1, piecesList).includes(color)
  ) {
    movableSpaces.push({
      rank: (rank - 1).toString(),
      file: fileNumbers.get(files.get(file)! - 1)!
    })
  }

  // Bottom middle
  if (!findPieceOnSpace(file, rank - 1, piecesList).includes(color)) {
    movableSpaces.push({
      rank: (rank - 1).toString(),
      file: file
    })
  }

  // Bottom right
  if (
    !findPieceOnSpace(fileNumbers.get(files.get(file)! + 1)!, rank - 1, piecesList).includes(color)
  ) {
    movableSpaces.push({
      rank: (rank - 1).toString(),
      file: fileNumbers.get(files.get(file)! + 1)!
    })
  }

  let illegalSpaces: BoardSpace[] = []
  for (const boardPiece of piecesList) {
    if (boardPiece.piece === oppositeColor + 'Pawn') {
      illegalSpaces = illegalSpaces.concat(getPawnTakes(boardPiece, piecesList))
      continue
    }
    if (boardPiece.piece === oppositeColor + 'King') {
      illegalSpaces = illegalSpaces.concat(getUncheckedKingMoves(boardPiece, piecesList))
      continue
    }
    if (boardPiece.piece.includes(oppositeColor)) {
      illegalSpaces = illegalSpaces.concat(getMovableSpaces(boardPiece, piecesList, enPassantPiece))
    }
  }

  for (const illegalMove of illegalSpaces) {
    movableSpaces = movableSpaces.filter(
      (move) => !(move.file === illegalMove.file && move.rank === illegalMove.rank)
    )
  }

  return movableSpaces
}

function getUncheckedKingMoves(piece: Piece, piecesList: Piece[]): BoardSpace[] {
  const movableSpaces: BoardSpace[] = []
  const file = piece.spaceName.charAt(0)
  const rank = parseInt(piece.spaceName.charAt(1))
  const color = piece.piece.includes('white') ? 'white' : 'black'

  // Top left
  if (
    !findPieceOnSpace(fileNumbers.get(files.get(file)! - 1)!, rank + 1, piecesList).includes(color)
  ) {
    movableSpaces.push({
      rank: (rank + 1).toString(),
      file: fileNumbers.get(files.get(file)! - 1)!
    })
  }

  // Top middle
  if (!findPieceOnSpace(file, rank + 1, piecesList).includes(color)) {
    movableSpaces.push({
      rank: (rank + 1).toString(),
      file: file
    })
  }

  // Top right
  if (
    !findPieceOnSpace(fileNumbers.get(files.get(file)! + 1)!, rank + 1, piecesList).includes(color)
  ) {
    movableSpaces.push({
      rank: (rank + 1).toString(),
      file: fileNumbers.get(files.get(file)! + 1)!
    })
  }

  // Left
  if (!findPieceOnSpace(fileNumbers.get(files.get(file)! - 1)!, rank, piecesList).includes(color)) {
    movableSpaces.push({
      rank: rank.toString(),
      file: fileNumbers.get(files.get(file)! - 1)!
    })
  }

  // Right
  if (!findPieceOnSpace(fileNumbers.get(files.get(file)! + 1)!, rank, piecesList).includes(color)) {
    movableSpaces.push({
      rank: rank.toString(),
      file: fileNumbers.get(files.get(file)! + 1)!
    })
  }

  // Bottom left
  if (
    !findPieceOnSpace(fileNumbers.get(files.get(file)! - 1)!, rank - 1, piecesList).includes(color)
  ) {
    movableSpaces.push({
      rank: (rank - 1).toString(),
      file: fileNumbers.get(files.get(file)! - 1)!
    })
  }

  // Bottom middle
  if (!findPieceOnSpace(file, rank - 1, piecesList).includes(color)) {
    movableSpaces.push({
      rank: (rank - 1).toString(),
      file: file
    })
  }

  // Bottom right
  if (
    !findPieceOnSpace(fileNumbers.get(files.get(file)! + 1)!, rank - 1, piecesList).includes(color)
  ) {
    movableSpaces.push({
      rank: (rank - 1).toString(),
      file: fileNumbers.get(files.get(file)! + 1)!
    })
  }
  return movableSpaces
}

export function isKingChecked(king: Piece, piecesList: Piece[], enPassantPiece: Piece): boolean {
  const file = king.spaceName.charAt(0)
  const rank = king.spaceName.charAt(1)
  const oppositeColor = king.piece.includes('white') ? 'black' : 'white'
  let illegalSpaces: BoardSpace[] = []

  for (const boardPiece of piecesList) {
    if (boardPiece.piece === oppositeColor + 'Pawn') {
      illegalSpaces = illegalSpaces.concat(getPawnTakes(boardPiece, piecesList))
      continue
    }
    if (boardPiece.piece === oppositeColor + 'King') {
      illegalSpaces = illegalSpaces.concat(getUncheckedKingMoves(boardPiece, piecesList))
      continue
    }
    if (boardPiece.piece.includes(oppositeColor)) {
      illegalSpaces = illegalSpaces.concat(
        getMovableSpacesNoCheckTest(boardPiece, piecesList, enPassantPiece)
      )
    }
  }

  for (const space of illegalSpaces) {
    if (file === space.file && rank === space.rank) {
      return true
    }
  }

  return false
}
