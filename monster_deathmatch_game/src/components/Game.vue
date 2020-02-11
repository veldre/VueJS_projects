<template>
  <div class="container">
    <div class="deathmatch" />
    <section class="players d-flex justify-content-around">
      <div class="player">
        <h4 class="player-name">
          {{ player }}
        </h4>
        <label>Health:</label>
        <div class="health-bar">
          <p class="healthRemaining">
            {{ playerHealth }}
          </p>
          <div
            class="health-left"
            :style="{ width: playerHealth + '%' }"
          />
          <div class="health-lost" />
        </div>
      </div>
      <div class="player">
        <h4 class="monster-name">
          MONSTER
        </h4>
        <label>Health:</label>
        <div class="health-bar">
          <p class="healthRemaining">
            {{ monsterHealth }}
          </p>
          <div
            class="health-left"
            :style="{ width: monsterHealth + '%' }"
          />
          <div class="health-lost" />
        </div>
      </div>
    </section>

    <section class="players d-flex justify-content-around">
      <div class="player">
        <label>Damage made to monster:</label>
        <br>
        <div class="power-bar">
          <p
            v-if="playerHit === playerMax"
            class="healthRemaining"
          >
            MAX
          </p>
          <p
            v-else
            class="healthRemaining"
          >
            {{ playerHit }}
          </p>
          <div
            class="hit-power"
            :style="{ width: playerAttackSize + '%' }"
          />
          <div class="health-lost" />
        </div>
        <label>Heals left: {{ heals }}</label>
        <br>
        <label
          v-if="specialAttackGained"
        >Special 20 point attacks left: {{ superAttack }} <br>EXTRA SPECIAL
          ATTACK !!!
        </label>
        <label v-else>Special 20 point attacks left: {{ superAttack }}</label>
      </div>
      <div class="player">
        <label>Damage made to player:</label>
        <div class="power-bar">
          <p
            v-if="monsterHit === monsterMax"
            class="healthRemaining"
          >
            MAX
          </p>
          <p
            v-else
            class="healthRemaining"
          >
            {{ monsterHit }}
          </p>
          <div
            class="hit-power"
            :style="{ width: monsterAttackSize + '%' }"
          />
          <div class="health-lost" />
        </div>
      </div>
    </section>

    <b-card class="button-area">
      <b-button
        v-if="!gameStarted"
        class="change-name"
        variant="light"
        :disabled="battleStarted"
        @click="changeName"
      >
        Change name
      </b-button>
      <b-button
        v-if="!gameStarted"
        variant="primary"
        @click="gameStarted = true"
      >
        Start Game
      </b-button>
      <div v-else>
        <b-button
          variant="danger"
          :disabled="gameEnded"
          @click="attack"
        >
          Attack
        </b-button><b-button
          variant="warning"
          :disabled="gameEnded || !specialAttackPossible"
          @click="specialAttack"
        >
          Special attack
        </b-button>
        <b-button
          variant="success"
          :disabled="!battleStarted || gameEnded || !heals || fullHealth"
          @click="heal"
        >
          Heal
        </b-button>
        <b-button @click="giveUp">
          {{ restart }}
        </b-button>
      </div>
    </b-card>
    <b-card
      v-for="(move, index) in moves"
      :key="index"
      class="logging"
    >
      <b-card-text
        class="designs"
        :class="classnames[move.id]"
      >
        {{ `${move.text}  ${move.hit} points` }}
      </b-card-text>
    </b-card>
  </div>
</template>
<script>
export default {
  name: "Game",
  props: {},

  data() {
    return {
      player: "PLAYER",
      gameStarted: false,
      restart: "Give up",
      playerHealth: 100,
      monsterHealth: 100,
      playerAttackSize: 0,
      monsterAttackSize: 0,
      playerMax: "",
      monsterMax: "",
      playerHit: 0,
      monsterHit: 0,
      gameEnded: false,
      winner: "",
      fullHealth: true,
      heals: 3,
      healing: false,
      superAttack: 1,
      specialAttackPossible: true,
      specialAttackGained: false,
      specialAttackMade: false,
      battleStarted: false,
      moves: [],
      movesCount: "",
      classnames: {
        Player: "player-design",
        Monster: "monster-design",
        Heal: "healing-design",
        Special: "special-attack-design"
      }
    };
  },
  methods: {
    attack() {
      if (!this.gameEnded) {
        this.movesCount++;
        this.fullHealth = false;
        this.battleStarted = true;
        const min = 1;
        const max = 10;
        const power = Math.floor(Math.random() * max) + min;

        this.playerHit = power;
        this.playerMax = max;
        this.moves.unshift({
          id: "Player",
          hit: this.playerHit,
          text: "Player attacks monster with"
        });

        this.playerAttackSize = (power / max) * 100;
        this.monsterHealth -= power;

        if (this.movesCount % 10 == 0) {
          this.superAttack++;
          this.specialAttackPossible = true;
          this.specialAttackGained = true;
        }

        if (this.monsterHealth <= 0) {
          this.monsterHealth = 0;
          this.gameEnded = true;
          this.winner = "Player";
          this.gameOver();
        } else {
          this.monsterAttack();
        }
      }
    },
    monsterAttack() {
      if (!this.gameEnded) {
        const min = 1;
        const max = 15;
        const power = Math.floor(Math.random() * max) + min;

        this.monsterHit = power;
        this.monsterMax = max;
        this.moves.unshift({
          id: "Monster",
          hit: this.monsterHit,
          text: "Monster attacks player with"
        });
        this.monsterAttackSize = (power / max) * 100;
        if (this.playerHealth - this.monsterHit <= 0) {
          this.playerHealth = 0;
          this.gameEnded = true;
          this.winner = "Monster";
          this.gameOver();
        } else {
          this.playerHealth -= power;
        }
      }
    },

    specialAttack() {
      this.moves.unshift({
        id: "Special",
        text: "Player deploys SUPER ATTACK with",
        hit: "20"
      });
      this.specialAttackMade = true;
      this.superAttack--;
      this.movesCount++;
      if (this.superAttack === 0) {
        this.monsterHealth -= 20;
        this.specialAttackPossible = false;
      } else {
        this.superAttack--;
        this.monsterHealth -= 20;
      }
      if (this.monsterHealth <= 0) {
        this.monsterHealth = 0;
        this.gameEnded = true;
        this.winner = "Player";
        this.gameOver();
      }
    },

    heal() {
      this.healing = true;
      if (this.playerHealth + 10 >= 100) {
        this.playerHealth = 100;
        this.heals--;
        this.fullHealth = true;
      } else {
        this.moves.unshift({
          id: "Heal",
          hit: "10",
          text: "Player heals with"
        });
        this.heals--;
        this.playerHealth += 10;
        this.monsterAttack();
      }
    },

    giveUp() {
      this.resetGame();
    },

    gameOver() {
      if (
        confirm(`${this.winner} has won this death match!
Play again?`)
      ) {
        this.resetGame();
      } else {
        this.restart = "Restart";
        return;
      }
    },

    changeName() {
      let player = prompt("Please enter your name:");
      if (player == "") {
        this.player = "PLAYER";
      } else {
        this.player = player.toUpperCase();
      }
    },

    resetGame() {
      (this.gameStarted = false),
        (this.playerHealth = 100),
        (this.monsterHealth = 100),
        (this.playerAttackSize = 0),
        (this.monsterAttackSize = 0),
        (this.playerMax = ""),
        (this.monsterMax = ""),
        (this.playerHit = 0),
        (this.monsterHit = 0),
        (this.gameEnded = false),
        (this.fullHealth = true),
        (this.heals = 3),
        (this.healing = false),
        (this.superAttack = 1),
        (this.specialAttackPossible = true),
        (this.specialAttackGained = false),
        (this.specialAttackMade = false),
        (this.battleStarted = false),
        (this.moves = []),
        (this.movesCount = ""),
        (this.classnames = {
          Player: "player-design",
          Monster: "monster-design",
          Heal: "healing-design",
          Special: "special-attack-design"
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.container {
  width: 900px;
  max-width: 80%;
  max-height: 100%;
  overflow: auto;
  background-color: #f4f0cb;
  padding: 5px;
  border-radius: 5px;
}

.deathmatch {
  height: 205px;
  background-image: url("monster.png");
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 5px;
}

h1 {
  margin: 0;
}

.player {
  width: 45%;
}

.player-name {
  padding: 20px 0;
}

.monster-name {
  font-family: "Eater", cursive;
  padding: 20px 0;
}

.health-bar {
  position: relative;

  width: 100%;
  height: 40px;

  margin-bottom: 10px;
  background-color: grey;
  color: white;
  font-weight: 900;
}

.health-left {
  height: 40px;
  background-color: green;
}

.health-lost {
  height: 40px;
  background-color: transparent;
}

.healthRemaining {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.power-bar {
  position: relative;
  width: 50%;
  height: 40px;
  margin-bottom: 10px;
  background-color: grey;
  color: white;
  font-weight: 900;
}

.hit-power {
  height: 40px;
  background-color: red;
}

button {
  margin: 9px 5px;
  font-weight: 900;
}

.button-area {
  display: flex;
  background-color: #b3a580;
}

.card-body {
  padding: 0;
}

.logging {
  height: 20px;
  margin: 2px 0;
  background-color: #ded29e;
  border: none;
}

.designs {
  width: 100%;
  height: 100%;
  font-weight: 900;
  font-size: 12px;
  border: 2px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.25rem;
}

.player-design {
  background-color: #5bc0de;
  color: white;
}

.monster-design {
  background-color: #d9534f;
  color: white;
}

.special-attack-design {
  background-color: #f0ad4e;
  color: white;
}

.healing-design {
  background-color: #5cb85c;
  color: white;
}
</style>
