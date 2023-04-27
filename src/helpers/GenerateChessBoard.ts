interface ChessBoardSpace {
  rank: string
  file: string
}

interface ChessPiece {
  spaceName: string
  piece: string
}

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

export function getWhiteBoard(): ChessBoardSpace[] {
  const chessBoard: ChessBoardSpace[] = []

  for (let i = 8; i > 0; i--) {
    for (let j = 0; j < files.length; j++) {
      chessBoard.push({ rank: i.toString(), file: files[j] })
    }
  }

  return chessBoard
}

export function getBlackBoard(): ChessBoardSpace[] {
  const chessBoard: ChessBoardSpace[] = []

  for (let i = 1; i < 9; i++) {
    for (let j = files.length - 1; j >= 0; j--) {
      chessBoard.push({ rank: i.toString(), file: files[j] })
    }
  }

  return chessBoard
}

export function getInitialPosition(): ChessPiece[] {
  return [
    { spaceName: 'a1', piece: 'whiteRook' },
    { spaceName: 'b1', piece: 'whiteKnight' },
    { spaceName: 'c1', piece: 'whiteBishop' },
    { spaceName: 'd1', piece: 'whiteQueen' },
    { spaceName: 'e1', piece: 'whiteKing' },
    { spaceName: 'f1', piece: 'whiteBishop' },
    { spaceName: 'g1', piece: 'whiteKnight' },
    { spaceName: 'h1', piece: 'whiteRook' },

    { spaceName: 'a2', piece: 'whitePawn' },
    { spaceName: 'b2', piece: 'whitePawn' },
    { spaceName: 'c2', piece: 'whitePawn' },
    { spaceName: 'd2', piece: 'whitePawn' },
    { spaceName: 'e2', piece: 'whitePawn' },
    { spaceName: 'f2', piece: 'whitePawn' },
    { spaceName: 'g2', piece: 'whitePawn' },
    { spaceName: 'h2', piece: 'whitePawn' },

    { spaceName: 'a8', piece: 'blackRook' },
    { spaceName: 'b8', piece: 'blackKnight' },
    { spaceName: 'c8', piece: 'blackBishop' },
    { spaceName: 'd8', piece: 'blackQueen' },
    { spaceName: 'e8', piece: 'blackKing' },
    { spaceName: 'f8', piece: 'blackBishop' },
    { spaceName: 'g8', piece: 'blackKnight' },
    { spaceName: 'h8', piece: 'blackRook' },

    { spaceName: 'a7', piece: 'blackPawn' },
    { spaceName: 'b7', piece: 'blackPawn' },
    { spaceName: 'c7', piece: 'blackPawn' },
    { spaceName: 'd7', piece: 'blackPawn' },
    { spaceName: 'e7', piece: 'blackPawn' },
    { spaceName: 'f7', piece: 'blackPawn' },
    { spaceName: 'g7', piece: 'blackPawn' },
    { spaceName: 'h7', piece: 'blackPawn' }
  ]
}
