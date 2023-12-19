class CreateScorms < ActiveRecord::Migration[7.0]
  def change
    create_table :scorms do |t|
      t.string :title
      t.string :reference
      t.string :version
      t.string :targetid

      t.timestamps
    end
  end
end
