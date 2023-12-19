# == Schema Information
#
# Table name: scorm_scos
#
#  id           :bigint           not null, primary key
#  identifier   :string
#  launch       :string
#  manifest     :string
#  organization :string
#  parent       :string
#  scorm        :bigint
#  scormtype    :string
#  title        :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
class ScormSco < ApplicationRecord
end
