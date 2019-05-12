<template>
  <div>
    <h1>リバーシやろう！！</h1>
    <h2> {{ labelOfCurrentStatus }} の番です。 </h2>
    <h3> 黒: {{ currentNumberOfBlack }}, 白: {{ currentNumberOfWhite }} </h3>
    <div style="font-size:0px" v-for="(row, i) in board" :key="i">
      <div
        class="item-area"
        v-for="(item, j) in row"
        :key="j"
        @click="putItem(item, i, j)"
        >
        <div
          class="black-circule"
          v-if="item === itemStatus.BLACK"
        ></div>
        <div
          class="white-circule"
          v-else-if="item === itemStatus.WHITE"
        ></div>
        <div
          class="none-circule"
          v-else
        ></div>
      </div>
    </div>
    <p>
      <button @click="reset()">はじめから</button>
      <button @click="nextTurn()">パス</button>
    </p>
  </div>
</template>

<script>
import {
  BOARD_LENGTH,
  ITEM_STATUS,
} from '../util/code.js'
import clonedeep from 'lodash.clonedeep';

export default {
  name: 'Reversi',
  data () {
    return {
      board: Array(BOARD_LENGTH).fill(Array(BOARD_LENGTH).fill(ITEM_STATUS.NONE)),
      currentStatus: '',
      directions: [],
    };
  },
  mounted() {
    this.reset();
    this.directions = [
      [0, 1], // 右
      [0, -1], // 左
      [1, 0], // 上
      [-1, 0], // 下
      [1, 1], // 右上
      [1, -1], // 左上
      [-1, -1], // 左下
      [-1, 1], // 右下
    ]
  },
  computed: {
    itemStatus() {
      return ITEM_STATUS;
    },
    labelOfCurrentStatus() {
      return this.getLabelOfStatus(this.currentStatus);
    },
    currentNumberOfBlack() {
      return this.board.flat().filter(status => status === ITEM_STATUS.BLACK).length;
    },
    currentNumberOfWhite() {
      return this.board.flat().filter(status => status === ITEM_STATUS.WHITE).length;
    },
    viewLabelOfSuperiority() {
      return this.currentNumberOfBlack > this.currentNumberOfWhite? this.getLabelOfStatus(ITEM_STATUS.BLACK): this.getLabelOfStatus(ITEM_STATUS.WHITE);
    },
    isFinished() {
      return this.currentNumberOfBlack + this.currentNumberOfWhite === BOARD_LENGTH * BOARD_LENGTH;
    },
    enemyStatus() {
      return this.currentStatus === ITEM_STATUS.BLACK? ITEM_STATUS.WHITE: ITEM_STATUS.BLACK;
    },
  },
  methods: {
    putItem(item, rowIndex, colIndex){
      if (item !== ITEM_STATUS.NONE) {
        return;
      }

      // ひっくり返せるマスを取得する。
      const reversibles = this.findAllReverible(rowIndex, colIndex);
      if (reversibles.length === 0) {
        return;
      }
      // ひっくり返す。
      this.board = this.reversi(reversibles, rowIndex, colIndex);

      // 盤面が全部埋まったらゲーム終了。埋まってなかったら打ち手をチェンジする。
      if (this.isFinished) {
        alert(`${this.viewLabelOfSuperiority}の勝ち！！`)
      } else {
        this.nextTurn();
      }
    },
    getLabelOfStatus(status){
      return status === ITEM_STATUS.BLACK ? '黒' : '白';
    },
    reset() {
      this.board = this.board.map((row,rowIndex) => {
        return row.map((col,colIndex) => {
         if((rowIndex === 3 && colIndex === 3) || (rowIndex === 4 && colIndex === 4)) {
           return ITEM_STATUS.BLACK;
         }
         if((rowIndex === 3 && colIndex === 4) || (rowIndex === 4 && colIndex === 3)) {
           return ITEM_STATUS.WHITE;
         }
         return ITEM_STATUS.NONE;
        })
      })
      this.currentStatus = ITEM_STATUS.BLACK;
    },
    nextTurn() {
      this.currentStatus = this.currentStatus === ITEM_STATUS.BLACK ? ITEM_STATUS.WHITE : ITEM_STATUS.BLACK;
    },
    validIndex(index) {
      return index >= 0 && index < BOARD_LENGTH;
    },
    status(x,y) {
      return this.board[x][y];
    },
    /**
     * ひっくり返す。
     */
    reversi(reversibles, rowIndex, colIndex){
      const editedBoard = clonedeep(this.board);
      editedBoard[rowIndex][colIndex] = this.currentStatus;
      reversibles.forEach(({ x, y }) => {
        editedBoard[x][y] = this.currentStatus;
      });
      return editedBoard;
    },

    /**
     * ひっくり返せるマスの座標を、配列で返却する。
     */
    findAllReverible(rowIndex, colIndex) {
      const counterArray = Array(BOARD_LENGTH).fill(0);

      // 8方向をそれぞれ判定。ひっくり返せるマスの座標を保持する配列を作成する。
      const reversibles = this.directions.map(([dx, dy] = d) => {
        // マスの座標とそこのステータスを保持する配列作る。
        const line = counterArray.map((_, i) => {
          const x = rowIndex + dx * (i + 1);
          const y = colIndex + dy * (i + 1);
          return { x, y };
        }).filter(({ x, y }) => {
          // 盤面からはみ出している座標は省く。
          return this.validIndex(x) && this.validIndex(y);
        }).map(({x, y}) => {
          return { coordinate: { x, y }, status: this.status(x,y)};
        });

        if (line.length < 2 || line[0].status !== this.enemyStatus) {
          // ここにきたら確実にひっくり返せない。
          return [];
        }

        let isSkipForNextStatusIsCurrent = false; // 次のマスに自分の色があるか判定するフラグ
        let isSkipForNotEnemyStatus = false; // 現在のマスが相手の色であるか判定するフラグ

        const reversibleLine = line.filter(({ _, status }, i) => {
          if (line.length === i + 1 || isSkipForNextStatusIsCurrent || isSkipForNotEnemyStatus) {
            return false;
          }
          if (status !== this.enemyStatus) {
            isSkipForNotEnemyStatus = true;
            return false;
          }
          if(this.status(line[i + 1].coordinate.x, line[i + 1].coordinate.y) === this.currentStatus) {
            isSkipForNextStatusIsCurrent = true;
          }
          // ここまできたらOK
          return true;
        }).map(({coordinate}) => coordinate).filter(() => {
          // 自分の色で挟めていない場合は全て省く。
          return isSkipForNextStatusIsCurrent
        });
        return reversibleLine;
      }).flat();

      return reversibles;
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h1 {
  font-weight: normal;
}

.item-area {
    background-color: #2b6f0280;
    border: solid 1px;
    width: 30px;
    height: 30px;
    text-align: -webkit-center;
    padding: 5px;
    display: inline-block;
}

.black-circule {
    border-radius: 50%;
    background-color: black;
    border: solid black;
    height: 15px;
    width: 15px;
    position: relative;
    top: 4px;
}

.white-circule {
    border-radius: 50%;
    border: solid white;
    background-color: white;
    height: 15px;
    width: 15px;
    position: relative;
    top: 4px;
}

.none-circule {
    background-color: #2b5d0e30;
}
</style>
