module.exports = function (sequelize, DataTypes) {
	return sequelize.define(
		'user',
		{
			id: {
				autoIncrement: true,
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			user_name: {
				type: DataTypes.STRING(45),
				allowNull: false,
				unique: 'user_name_UNIQUE',
			},
			user_github_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				unique: 'user_github_id_UNIQUE',
			},
		},
		{
			sequelize,
			tableName: 'user',
			timestamps: false,
			indexes: [
				{
					name: 'PRIMARY',
					unique: true,
					using: 'BTREE',
					fields: [{ name: 'id' }],
				},
				{
					name: 'user_name_UNIQUE',
					unique: true,
					using: 'BTREE',
					fields: [{ name: 'user_name' }],
				},
				{
					name: 'user_github_id_UNIQUE',
					unique: true,
					using: 'BTREE',
					fields: [{ name: 'user_github_id' }],
				},
			],
		},
	);
};
