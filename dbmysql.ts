
const mysql = require('promise-mysql');

//Interface para la informacion que se maneja en cada metodo
interface ParamsData {
    table: string,
    id?: string,
    data?: any,
    idvalue?: any,
    fields?: []
}

class MySqlDBConecction {

    private cnn: any;

    constructor(
        private host: string = "",
        private user: string = "",
        private pass: string = "",
        private database: string = "",
    ) { }
    
    async conectarBD() {
        this.cnn = await mysql.createPool({
            connectionLimit: 2,
            host: process.env.MYSQL_SERVER || this.host,
            user: process.env.MYSQL_USER || this.user,
            password: process.env.MYSQL_PW || this.pass,
            database: process.env.MYSQL_DB || this.database
        });

        try {
            let testconection = await this.cnn.query(`use ${process.env.MYSQL_DB};`);
            console.log(`Database ${process.env.MYSQL_DB} conected!`);
        } catch (error) {
            console.log(`ERROR database conection!: ${error} `);
        }

    }

    getC() {
        return this.cnn;
    }

    private desconectarDB() {
        this.cnn.end(() => {
            console.log("DataBase DISCONNECTED!");
        });
    }

    async querySelect(sql: string, data?: any) {
        let result: any = null;
        if (!data) {
            result = await this.cnn.query(sql);
        } else {
            result = await this.cnn.query(sql, data);
        }
        return result;
    }

    async save(param: ParamsData) {
        const { table, data } = param;
        if (!table && !data) { return { error: "Incomplete Data!!!" } }
        const result = await this.cnn.query(`INSERT INTO ${table} SET ? `, data);
        return result;
    }

    async update(param: ParamsData) {
        const { table, data, id, idvalue } = param;
        if (!data) { return { error: "Incomplete Parameters!!!" } }
        //console.log("dataid", data[id]); return ;
        //  try {
        if (!data[id]) {
            if (!idvalue) { return { error: "Incomplete Parameters!!!" } }
        }
        const result = await this.cnn.query(`UPDATE ${table} SET ? WHERE ${id} = ? `, [data, data[id] ? data[id || ""] : idvalue]);
        return result;
        /* } catch (error) {
            return error;
        } */
    }

    async remove(param: ParamsData) {
        const { table, data, id } = param;
        if (!data && !id) { return { error: "Incomplete Parameters!!!" } }
        //try {
        const result = await this.cnn.query(`DELETE FROM ${table} WHERE ${id} = ? `, data[id || ""]);
        return result;
        /* } catch (error) {
            return error;
        } */
    }

    async findAll(param: ParamsData) {
        const { table } = param;
        //try {
        const result = await this.cnn.query(`SELECT * FROM ${table}`);
        return result;
        /* } catch (error) {
            return error;
        } */
    }

    async findOne(param: ParamsData) {
        const { table, id, idvalue } = param;
        if (!idvalue && !id) { return { error: "Incomplete Parameters!!!" } }
        const result = await this.cnn.query(`SELECT * FROM ${table} WHERE ${id} = ? `, [idvalue]);
        return result;

    }

    async find(param: ParamsData) {
        const { table, id, idvalue } = param;
        if (!idvalue && !id) { return { error: "Incomplete Parameters!!!" } }
        const result = await this.cnn.query(`SELECT * FROM ${table} WHERE ${id} = ? `, [idvalue]);
        return result;

    }

}

const dbConnection = new MySqlDBConecction();

export default dbConnection;
