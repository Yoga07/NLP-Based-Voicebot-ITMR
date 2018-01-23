import pymongo
import pprint
import json
from json2table import convert
import pdfkit

'''
Connecting MongoDb and getting values stored in the Database
'''


def read():
    try:
	    client=pymongo.MongoClient('localhost',27017)   #Db connect
	    db=client.dbx
	    empCol = db.formx.find()
	    for emp in empCol:
		   temp=emp
	    build_direction = "LEFT_TO_RIGHT"
	    table_attributes = {"style" : "width:100%"}
	    html = convert(emp, build_direction=build_direction, table_attributes=table_attributes)
	    file = open('testfile.html', 'w')
	    file.write(html)
	    file.close()
	    pdfkit.from_file('testfile.html', 'application.pdf')

    except Exception, e:
        print str(e)
    
    print("CONVERTED TO PDF")
def main():
    read() 

if __name__ == '__main__':
    main()


