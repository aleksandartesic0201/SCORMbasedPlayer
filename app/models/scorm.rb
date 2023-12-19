# == Schema Information
#
# Table name: scorms
#
#  id         :bigint           not null, primary key
#  reference  :string
#  targetid   :string
#  title      :string
#  version    :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class Scorm < ApplicationRecord
end
