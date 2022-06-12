import { User } from './user';
import { GameRoom, GameStatus } from './game-room';
import { Bet } from './bet';
import { BetWinner, IRoundResult, UserResultStatus } from './model';
import { Card, CardSuit } from './card';

jest.mock('mobx', () => ({
  action: jest.fn(),
  computed: jest.fn(),
  makeObservable: jest.fn(),
  observable: jest.fn(),
  runInAction: (fn) => fn(),
}));

describe('game-room.ts', () => {
  let gameRoom: GameRoom;
  let user: User;
  const userMoney = 100;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.resetAllMocks();
    user = new User('1', 'test', userMoney);
    gameRoom = new GameRoom(user);
  });

  it('should create game room', () => {
    expect(gameRoom).toBeDefined();
    expect(gameRoom.status).toBe(GameStatus.GAME_NOT_STARTED);
  });

  it.each([
    {
      betAmount: 10,
      betWinner: BetWinner.Banker,
      winner: BetWinner.Banker,
      expected: 19.5,
    },
    {
      betAmount: 10,
      betWinner: BetWinner.Player,
      winner: BetWinner.Player,
      expected: 20,
    },
    {
      betAmount: 10,
      betWinner: BetWinner.Tie,
      winner: BetWinner.Tie,
      expected: 80,
    },
    {
      betAmount: 10,
      betWinner: BetWinner.Player,
      winner: BetWinner.Tie,
      expected: 0,
    },
  ])(
    'should calculate prize for value $betAmount if winner is $winner and player bet on $betWinner and return $expected',
    ({ betAmount, winner, betWinner, expected }) => {
      const bet = new Bet();
      bet.amount = betAmount;
      bet.winner = betWinner;
      //@ts-expect-error
      const prize = gameRoom.calculatePrize(bet, winner);
      expect(prize).toBe(expected);
    }
  );

  it('should not clear user bet if game is not accepting bets', () => {
    gameRoom.user.bet.amount = 10;
    gameRoom.clearBet();
    expect(gameRoom.user.bet.amount).toBe(10);
  });

  it('should clear user bet if game is accepting bets', () => {
    gameRoom['status'] = GameStatus.BETTING_OPENED;
    gameRoom.user.bet.amount = 10;
    gameRoom.clearBet();
    expect(gameRoom.user.bet.amount).toBe(0);
  });

  it('should accept user bet if game is accepting bets', () => {
    const spy = jest.spyOn(gameRoom.user.bet, 'increseBet');
    gameRoom['status'] = GameStatus.BETTING_OPENED;
    gameRoom.acceptBet(BetWinner.Player);
    expect(spy).toHaveBeenCalled();
  });

  it('should not accept user bet if game is not accepting bets', () => {
    const spy = jest.spyOn(gameRoom.user.bet, 'increseBet');
    gameRoom.acceptBet(BetWinner.Player);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should set stop', () => {
    gameRoom.setStop(true);
    expect(gameRoom.stop).toBe(true);
  });

  it('should append history', () => {
    const item: IRoundResult = {
      winner: BetWinner.Player,
      earnings: 10,
      userStatus: UserResultStatus.Lose,
    };
    gameRoom['appendHistory'](item);
    expect(gameRoom.history).toEqual([item]);
  });

  it('should trim history to historyMaxSize if appended length is bigger', () => {
    (gameRoom.config as any).historyMaxSize = 5;
    const historyItems: IRoundResult[] = [
      {
        winner: BetWinner.Player,
        earnings: 0,
        userStatus: UserResultStatus.Lose,
      },
      {
        winner: BetWinner.Player,
        earnings: 0,
        userStatus: UserResultStatus.Lose,
      },
      {
        winner: BetWinner.Player,
        earnings: 0,
        userStatus: UserResultStatus.Lose,
      },
      {
        winner: BetWinner.Player,
        earnings: 0,
        userStatus: UserResultStatus.Lose,
      },
      {
        winner: BetWinner.Player,
        earnings: 0,
        userStatus: UserResultStatus.Lose,
      },
    ];
    gameRoom.history = historyItems;
    const item: IRoundResult = {
      winner: BetWinner.Player,
      earnings: 50,
      userStatus: UserResultStatus.NotPlayed,
    };
    gameRoom['appendHistory'](item);
    expect(gameRoom.history.length).toBe(5);
    expect(gameRoom.history[0]).toEqual(item);
  });

  it('should draft two cards to player and banker', () => {
    const spyPlayer = jest.spyOn(gameRoom.player, 'acceptCards');
    const spyBanker = jest.spyOn(gameRoom.banker, 'acceptCards');
    gameRoom['draftCards']();
    expect(spyPlayer).toHaveBeenCalled();
    expect(spyBanker).toHaveBeenCalled();
  });

  describe('Draft thrid card', () => {
    let playerAcceptCardsSpy: jest.SpyInstance;
    let bankerAcceptCardsSpy: jest.SpyInstance;

    beforeEach(() => {
      playerAcceptCardsSpy = jest.spyOn(gameRoom.player, 'acceptCards');
      bankerAcceptCardsSpy = jest.spyOn(gameRoom.banker, 'acceptCards');
    });

    it('should not draft thrid card if player has natural', () => {
      jest.spyOn(gameRoom.player, 'hasNatural', 'get').mockReturnValue(true);
      gameRoom['draftThirdCard']();
      expect(playerAcceptCardsSpy).not.toHaveBeenCalled();
      expect(bankerAcceptCardsSpy).not.toHaveBeenCalled();
    });

    it('should not draft thrid card if banker has natural', () => {
      jest.spyOn(gameRoom.banker, 'hasNatural', 'get').mockReturnValue(true);
      gameRoom['draftThirdCard']();
      expect(playerAcceptCardsSpy).not.toHaveBeenCalled();
      expect(bankerAcceptCardsSpy).not.toHaveBeenCalled();
    });

    it('should not draft third card for player if player score >5', () => {
      jest.spyOn(gameRoom.player, 'score', 'get').mockReturnValue(6);
      gameRoom['draftThirdCard']();
      expect(playerAcceptCardsSpy).not.toHaveBeenCalled();
    });

    it('should draft thrid card for player if player score <5', () => {
      jest.spyOn(gameRoom.player, 'score', 'get').mockReturnValue(4);
      gameRoom['draftThirdCard']();
      expect(playerAcceptCardsSpy).toHaveBeenCalled();
    });

    it('should draft thrid card for banker if banker score <5 and player did not take card', () => {
      jest.spyOn(gameRoom.player, 'score', 'get').mockReturnValue(6);
      jest.spyOn(gameRoom.banker, 'score', 'get').mockReturnValue(4);
      gameRoom['draftThirdCard']();
      expect(bankerAcceptCardsSpy).toHaveBeenCalled();
      expect(playerAcceptCardsSpy).not.toHaveBeenCalled();
    });

    it("banker should not take card if baker's score >5 and player didn't take card", () => {
      jest.spyOn(gameRoom.player, 'score', 'get').mockReturnValue(6);
      jest.spyOn(gameRoom.banker, 'score', 'get').mockReturnValue(6);
      gameRoom['draftThirdCard']();
      expect(bankerAcceptCardsSpy).not.toHaveBeenCalled();
      expect(playerAcceptCardsSpy).not.toHaveBeenCalled();
    });

    describe('banker score is 7', () => {
      it.each([1, 2, 3, 4, 5, 6, 7, 8, 9])(
        'should not take card if banker score is 5 and player score is %i',
        (value) => {
          jest.spyOn(gameRoom.player, 'score', 'get').mockReturnValue(4);
          jest.spyOn(gameRoom.banker, 'score', 'get').mockReturnValue(7);
          jest
            .spyOn(gameRoom.deck, 'take')
            .mockReturnValue([
              new Card({ value: value, suit: CardSuit.Spade, face: null }),
            ]);
          gameRoom['draftThirdCard']();
          expect(bankerAcceptCardsSpy).not.toHaveBeenCalled();
        }
      );
    });

    describe('banker score is 6', () => {
      it.each([1, 2, 3, 4, 5, 8, 9])(
        'should not take card and player score is %i',
        (value) => {
          jest.spyOn(gameRoom.player, 'score', 'get').mockReturnValue(4);
          jest.spyOn(gameRoom.banker, 'score', 'get').mockReturnValue(6);
          jest
            .spyOn(gameRoom.deck, 'take')
            .mockReturnValue([
              new Card({ value: value, suit: CardSuit.Spade, face: null }),
            ]);
          gameRoom['draftThirdCard']();
          expect(bankerAcceptCardsSpy).not.toHaveBeenCalled();
        }
      );

      it.each([6, 7])(
        "banker should take card when player's third card was %i",
        (value) => {
          jest.spyOn(gameRoom.player, 'score', 'get').mockReturnValue(4);
          jest.spyOn(gameRoom.banker, 'score', 'get').mockReturnValue(6);
          jest
            .spyOn(gameRoom.deck, 'take')
            .mockReturnValue([
              new Card({ value: value, suit: CardSuit.Spade, face: null }),
            ]);
          gameRoom['draftThirdCard']();
          expect(bankerAcceptCardsSpy).toHaveBeenCalled();
        }
      );
    });

    describe('banker score is 5', () => {
      it.each([1, 2, 3, 8, 9])(
        'should not take card if banker score is 5 and player score is %i',
        (value) => {
          jest.spyOn(gameRoom.player, 'score', 'get').mockReturnValue(4);
          jest.spyOn(gameRoom.banker, 'score', 'get').mockReturnValue(5);
          jest
            .spyOn(gameRoom.deck, 'take')
            .mockReturnValue([
              new Card({ value: value, suit: CardSuit.Spade, face: null }),
            ]);
          gameRoom['draftThirdCard']();
          expect(bankerAcceptCardsSpy).not.toHaveBeenCalled();
        }
      );

      it.each([4, 5, 6, 7])(
        "banker should take card when player's third card was %i",
        (value) => {
          jest.spyOn(gameRoom.player, 'score', 'get').mockReturnValue(4);
          jest.spyOn(gameRoom.banker, 'score', 'get').mockReturnValue(5);
          jest
            .spyOn(gameRoom.deck, 'take')
            .mockReturnValue([
              new Card({ value: value, suit: CardSuit.Spade, face: null }),
            ]);
          gameRoom['draftThirdCard']();
          expect(bankerAcceptCardsSpy).toHaveBeenCalled();
        }
      );
    });

    describe('banker score is 4', () => {
      it.each([1, 8, 9])(
        'should not take card and player score is %i',
        (value) => {
          jest.spyOn(gameRoom.player, 'score', 'get').mockReturnValue(4);
          jest.spyOn(gameRoom.banker, 'score', 'get').mockReturnValue(4);
          jest
            .spyOn(gameRoom.deck, 'take')
            .mockReturnValue([
              new Card({ value: value, suit: CardSuit.Spade, face: null }),
            ]);
          gameRoom['draftThirdCard']();
          expect(bankerAcceptCardsSpy).not.toHaveBeenCalled();
        }
      );

      it.each([2, 3, 4, 5, 6, 7])(
        "banker should take card when player's third card was %i",
        (value) => {
          jest.spyOn(gameRoom.player, 'score', 'get').mockReturnValue(4);
          jest.spyOn(gameRoom.banker, 'score', 'get').mockReturnValue(4);
          jest
            .spyOn(gameRoom.deck, 'take')
            .mockReturnValue([
              new Card({ value: value, suit: CardSuit.Spade, face: null }),
            ]);
          gameRoom['draftThirdCard']();
          expect(bankerAcceptCardsSpy).toHaveBeenCalled();
        }
      );
    });

    describe('banker score is 3', () => {
      it.each([8])('should not take card and player score is %i', (value) => {
        jest.spyOn(gameRoom.player, 'score', 'get').mockReturnValue(4);
        jest.spyOn(gameRoom.banker, 'score', 'get').mockReturnValue(3);
        jest
          .spyOn(gameRoom.deck, 'take')
          .mockReturnValue([
            new Card({ value: value, suit: CardSuit.Spade, face: null }),
          ]);
        gameRoom['draftThirdCard']();
        expect(bankerAcceptCardsSpy).not.toHaveBeenCalled();
      });

      it.each([1, 2, 3, 4, 5, 6, 7, 9])(
        "banker should take card when player's third card was %i",
        (value) => {
          jest.spyOn(gameRoom.player, 'score', 'get').mockReturnValue(4);
          jest.spyOn(gameRoom.banker, 'score', 'get').mockReturnValue(3);
          jest
            .spyOn(gameRoom.deck, 'take')
            .mockReturnValue([
              new Card({ value: value, suit: CardSuit.Spade, face: null }),
            ]);
          gameRoom['draftThirdCard']();
          expect(bankerAcceptCardsSpy).toHaveBeenCalled();
        }
      );
    });

    describe('banker score is 3', () => {
      it.each([8])('should not take card and player score is %i', (value) => {
        jest.spyOn(gameRoom.player, 'score', 'get').mockReturnValue(4);
        jest.spyOn(gameRoom.banker, 'score', 'get').mockReturnValue(3);
        jest
          .spyOn(gameRoom.deck, 'take')
          .mockReturnValue([
            new Card({ value: value, suit: CardSuit.Spade, face: null }),
          ]);
        gameRoom['draftThirdCard']();
        expect(bankerAcceptCardsSpy).not.toHaveBeenCalled();
      });

      it.each([1, 2, 3, 4, 5, 6, 7, 9])(
        "banker should take card when player's third card was %i",
        (value) => {
          jest.spyOn(gameRoom.player, 'score', 'get').mockReturnValue(4);
          jest.spyOn(gameRoom.banker, 'score', 'get').mockReturnValue(3);
          jest
            .spyOn(gameRoom.deck, 'take')
            .mockReturnValue([
              new Card({ value: value, suit: CardSuit.Spade, face: null }),
            ]);
          gameRoom['draftThirdCard']();
          expect(bankerAcceptCardsSpy).toHaveBeenCalled();
        }
      );
    });

    describe('banker score is 2', () => {
      it.each([1, 2, 3, 4, 5, 6, 7, 8, 9])(
        "banker should take card when player's third card was %i",
        (value) => {
          jest.spyOn(gameRoom.player, 'score', 'get').mockReturnValue(4);
          jest.spyOn(gameRoom.banker, 'score', 'get').mockReturnValue(2);
          jest
            .spyOn(gameRoom.deck, 'take')
            .mockReturnValue([
              new Card({ value: value, suit: CardSuit.Spade, face: null }),
            ]);
          gameRoom['draftThirdCard']();
          expect(bankerAcceptCardsSpy).toHaveBeenCalled();
        }
      );
    });

    it('should reset detck if deck length is less than minDeckSize', () => {
      (gameRoom.config as any).minDeckSize = 150;
      gameRoom.deck.cards.splice(0, 200);
      const prevCards = gameRoom.deck.cards;
      expect(gameRoom.deck.cards.length).toBeLessThan(150);
      gameRoom['resetRound']();
      expect(prevCards).not.toBe(gameRoom.deck.cards);
      expect(gameRoom.deck.cards.length).toBeGreaterThan(150);
    });
  });
});
