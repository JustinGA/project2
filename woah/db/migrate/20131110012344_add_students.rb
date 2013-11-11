class AddStudents < ActiveRecord::Migration
  def change
    create_table :students do |t|
      t.string :name, null: false
      t.string :email, null: false
      t.string :classroom, null: false

      t.timestamps
    end
    create_table :questions do |t|
      t.text :question, null: false
      t.string :title
      t.string :author, null: false
      t.boolean :answered, default: false

      t.timestamps
    end

    create_table :questions_students do |t|
    t.belongs_to :student, null: false
    t.belongs_to :question, null: false
    end


    reversible do |dir|
     dir.up do
      execute <<-SQL
      ALTER TABLE questions_students
      ADD CONSTRAINT fk_students
      FOREIGN KEY (student_id)
      REFERENCES students(id),
      ADD CONSTRAINT fk_questions
      FOREIGN KEY (question_id)
      REFERENCES questions(id)
      SQL
      end
    end
  end
end
