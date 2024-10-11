import {bot} from "@index";
import User from "./User";
import IUserReferral from "@interfaces/IUserReferral";
import IUserReferralQuery from "@interfaces/IUserReferralQuery";

export default class UserReferral implements IUserReferral{
    id:number;
    private _agents: Map<number,IUserReferralQuery> = new Map()
    private _agentsApprove!:number
    private _user!:IUserReferralQuery;
    private readonly _key: string;
    constructor(id:number,key:string) {
        this.id = id
        this._key = key
    }
    async load(): Promise<UserReferral> {
        try {
            const [agents, user] = await Promise.all([
                querySQL.agents(this.id),
                querySQL.user(this.id)
            ]);

            agents.forEach(agent => this._agents.set(agent.userId, agent));

            this._agentsApprove = await this.calculateApprovedAgents(agents);
            this._user = user;

            return this;
        } catch (error) {
            console.error('Error loading UserReferral:', error);
            throw error;
        }
    }

    get agentsApprove(): number {
        return this._agentsApprove;
    }

    get agents(): Map<number, IUserReferralQuery> {
        return this._agents;
    }

    get user(): IUserReferralQuery {
        return this._user;
    }

    get key(): string {
        return this._key;
    }

    insertReferral(userId: number): void {
        this._agents.set(userId, { agentId: this.id, userId, refKey: this._key });

        const query = `INSERT INTO referrals (agentId, userId, refKey) VALUES (?, ?, ?)`;
        bot.connection.query(query, [this.id, userId, this._key], (err) => {
            if (err) {
                console.error('SQL ERROR in insertReferral:', err.message);
            }
        });
    }

    private async calculateApprovedAgents(agents: IUserReferralQuery[]): Promise<number> {
        const approvalPromises = agents.map(async (agent) => {
            const user = await new User().load(agent.userId);
            return (user.payment.status > 1 && user.payment.paid === 'true') ? 1 : 0;
        });

        const approvals = await Promise.all(approvalPromises);
        return approvals.reduce((sum:number, value) => sum + value, 0);
    }
}

const querySQL = {
    agents: async (agentId: number): Promise<IUserReferralQuery[]> => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM referrals WHERE agentId = ?';
            bot.connection.query(query, [agentId], (err, results: IUserReferralQuery[]) => {
                if (err) {
                    return reject(new Error('SQL ERROR in UserReferral - agents: ' + err.message));
                }
                resolve(results);
            });
        });
    },

    user: async (userId: number): Promise<IUserReferralQuery> => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM referrals WHERE userId = ?';
            bot.connection.query(query, [userId], (err, results: IUserReferralQuery[]) => {
                if (err) {
                    return reject(new Error('SQL ERROR in UserReferral - user: ' + err.message));
                }
                resolve(results[0]);
            });
        });
    }
}