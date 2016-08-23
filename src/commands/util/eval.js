'use babel';
'use strict';

/* eslint-disable no-unused-vars */
import util from 'util';
import * as graf from '../..';
import Command from '../command';
import FriendlyError from '../../errors/friendly';
import CommandFormatError from '../../errors/command-format';
/* eslint-enable no-unused-vars */

const nl = '!!NL!!';
const nlPattern = new RegExp(nl, 'g');

export default class EvalCommand extends Command {
	constructor(bot) {
		super(bot, {
			name: 'eval',
			module: 'util',
			memberName: 'eval',
			description: 'Evaluates input as JavaScript.',
			usage: 'eval <script>',
			details: 'Only the bot owner may use this command.'
		});

		this.lastResult = null;
		this.objects = bot.evalObjects;
	}

	hasPermission(server, user) {
		return this.bot.permissions.isOwner(user);
	}

	async run(message, args) {
		if(!args[0]) throw new CommandFormatError(this, message.server);

		/* eslint-disable no-unused-vars */
		const msg = message;
		const bot = this.bot;
		const client = message.client;
		const objects = this.objects;
		const doReply = val => {
			if(val instanceof Error) {
				message.reply(`Callback error: \`${val}\``);
			} else {
				const inspected = util.inspect(val, { depth: 0 });
				message.reply(`Callback result: \`${inspected.length < 1925 ? inspected : val}\``);
			}
		};
		/* eslint-enable no-unused-vars */

		try {
			this.lastResult = eval(args[0]);
			return this.bot.util.split(`Result: \`${util.inspect(this.lastResult, { depth: 0 }).replace(nlPattern, '\n')}\``);
		} catch(err) {
			return `Error while evaluating: ${err}`;
		}
	}
}
