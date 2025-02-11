BEGIN TRY

BEGIN TRAN;

-- RedefineTables
BEGIN TRANSACTION;
DECLARE @SQL NVARCHAR(MAX) = N''
SELECT @SQL += N'ALTER TABLE '
    + QUOTENAME(OBJECT_SCHEMA_NAME(PARENT_OBJECT_ID))
    + '.'
    + QUOTENAME(OBJECT_NAME(PARENT_OBJECT_ID))
    + ' DROP CONSTRAINT '
    + OBJECT_NAME(OBJECT_ID) + ';'
FROM SYS.OBJECTS
WHERE TYPE_DESC LIKE '%CONSTRAINT'
    AND OBJECT_NAME(PARENT_OBJECT_ID) = 'Square'
    AND SCHEMA_NAME(SCHEMA_ID) = 'dbo'
EXEC sp_executesql @SQL
;
CREATE TABLE [dbo].[_prisma_new_Square] (
    [id] INT NOT NULL IDENTITY(1,1),
    [value] BIT NOT NULL CONSTRAINT [Square_value_df] DEFAULT 0,
    CONSTRAINT [Square_pkey] PRIMARY KEY CLUSTERED ([id])
);
SET IDENTITY_INSERT [dbo].[_prisma_new_Square] ON;
IF EXISTS(SELECT * FROM [dbo].[Square])
    EXEC('INSERT INTO [dbo].[_prisma_new_Square] ([id],[value]) SELECT [id],[value] FROM [dbo].[Square] WITH (holdlock tablockx)');
SET IDENTITY_INSERT [dbo].[_prisma_new_Square] OFF;
DROP TABLE [dbo].[Square];
EXEC SP_RENAME N'dbo._prisma_new_Square', N'Square';
COMMIT;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
