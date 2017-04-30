var bet = 30;
var mart = 1;  //1 para habilitar o martingale e 0 para desabilitar
searchLastBomb = 1;  //1 para habilitar o clique no local da última bomba e 0 para desabilitar

/* in case the bot will click a bomb, bet will be adjusted on the next round to compensate the loss.
the bot will set the bet again to the original value on the next next round.*/
var bigBet = bet/.039;
bigBet = Math.ceil(bigBet);

var risky_bet_chance = 0;

/* click sequence interval in milliseconds. equivalent to 2 seconds.
You can change it to longer than 2 seconds but please don't change it to a lower value because it can messed up the timings if you have a slow internet. If you have a very slow internet connection, I recommend setting it up to 3 seconds or higher. */
var interval = 1500;

var restart, tile1, timeout1, timeout2, timeout3;
var k = 0;
var b = 0;
var win = 0;
var lost = 0;
var lucro = 0;

// force the difficulty to 1 mine at the start of the game.
$('.quarter').first().find('button').click();

start_game();

function start_game() {
    var risky_bet = Math.floor((Math.random() * 100) + 1);

	if(restart == 1){
        if (risky_bet < risky_bet_chance) {
            if (mart == 1){
                 $('#bet').val(1.5*bigBet);
            } else {
                 $('#bet').val(bet);
            }
        } else {
            if (mart == 1){
                 $('#bet').val(bigBet);
            } else {
                 $('#bet').val(bet);
            }
        }
		restart = 0;
	} else {
        if (risky_bet < risky_bet_chance) {
            if (mart == 1){
                 $('#bet').val(1.5*bigBet);
            } else {
                 $('#bet').val(bet);
            }
        } else {
            $('#bet').val(bet);
        }
	}
    $('#start_game').click();
    if(win > lost){
        lucro = win - lost;
        lucro = ' Lucro de:'+ lucro;
    }else if(lost > win){
        lucro = lost - win;
        lucro = ' Perda de:'+ lucro;
    }else{
        lucro = ' Empate';
    }
    console.log('Acertos:'+k+' Bombas:'+b+' Ganho:'+win+' Perda:'+lost+lucro);
    timeout1 = setTimeout(click_tile1, interval)
} // end of function start_game()

function click_tile1() {
    if (searchLastBomb == 1){
        var has_chosen = 0;
	if($('.game_left').eq(1) != null && $('.game_left').eq(1).length > 0){
		$('.game_left').eq(1).find('.board').find('li').each(function(i,elem){
			if($(elem).hasClass('reveal')){
				has_chosen = 1;
				tile1 = $(elem).data('tile');
				return false;
			}
		});
	}
	if(has_chosen == 0){
		tile1 = Math.floor((Math.random() * 25) + 1);
	}
    }else{
        var tile1 = Math.floor((Math.random() * 25) + 1);
    }
    $('.game_left').first().find('li[data-tile='+tile1+']').click();
    $('.game_left [data-tile="'+tile1+'"]').click();
	setTimeout(function(){
		if($('.game_left').first().find('li[data-tile='+tile1+']').hasClass('bomb')){
            b++;
            loose = $('.messages .bomb').html();
            loose = loose.split(" ");
            loose = loose[11].replace(',','');
            lost = Number(loose) + lost;
			var bal = $('.balance .num').html();
			bal = $.trim(bal);
			bal = bal.replace(',','');
			bal = parseInt(bal);
            bal = bigBet // practice mode

			if(bal < bigBet){
				stopgame();
			} else {
				restart = 1;
				start_game();
			}

		}else{
            k++;
            prize = $('.find span').html();
            if (prize){
                prize = prize.split(" ");
                win = Number(prize[0]) + win;
            }else{
                win = win;
            }
			timeout2 = setTimeout(cashout, interval);
		}
	}, interval);

} // end of function click_tile()

function cashout() {
	$('.game_right').first().find('.cashout').click();
    timeout3 = setTimeout(start_game, interval);
} // end of cashout

function stopgame(){
	clearTimeout(timeout1);
	clearTimeout(timeout2);
	clearTimeout(timeout3);
} // end of stopgame()