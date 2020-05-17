from copy import copy
import numpy as np
import pandas as pd
from operator import itemgetter
import datetime

#start = datetime.datetime.now()
class BuildShiftLogic:

    def get_shifts(self):

        # create all the possible matrix
        self.travel_matrix(self.example, 0, 0)

        # count for each matrix how many worker shifted in
        result = self.create_list_matrix_and_count_shift()

        # get list of matrix with higest number of worker shifted
        result = self.get_list_of_max_matrix(result)

        #print_list_as_matrix(result)
        return self.get_max_rank_matrix(result, self.rank_matrix)


    def __init__(self, rank_matrix,available_matrix):
        self.rank_matrix=rank_matrix
        self.available_matrix=available_matrix
        self.test_list = []
        # example = np.array([[0,0,1,1,0,0],[0,1,0,1,1,0],[0,0,0,1,0,1],[0,1,0,1,0,1],[1,1,0,1,0,0],[0,0,1,0,0,0]])
        self.example = np.array([[1, 1, 1], [1, 0, 1]])
        self.rank_matrix = np.array([[3, 3, 5], [1, 2, 8]])
        self.amount_of_worker_in_shift = [1, 1, 1]
        self.shift_start_by_day = [0, 0, 2]
        self.rows, self.cols = self.create_cols_and_rows(self.example)



    def create_cols_and_rows(matrix):
        rows=[]
        cols=[]

        for i in range(matrix.shape[0]+1):
            cols.append("shift"+str(i))

        #for j in range(matrix.shape[1]+1):
        #    rows.append("shift"+str(j))
        rows = ["worker1", "worker2"]  # , "worker3", "worker4", "worker5","worker6"]
        return rows,cols

    def travel_matrix(self,matrix,x,y):
        if(y==matrix.shape[0]):
            self.test_list.append(matrix)
            return

        if matrix[y, x] == 1:
            copy_of_matrix = np.copy(matrix)
            copy_of_matrix[y,x]=0
            self.travel_matrix(copy_of_matrix,x,y)
            if not self.validate_matrix(matrix, x, y):
                return

        if(x<matrix.shape[1]-1):
            x += 1
        else:
            y += 1
            x = 0
        self.travel_matrix(matrix, x, y)
        return

    def validate_matrix(self,matrix,x,y):
        if(matrix[y,x]==0):
            print("warning")

        workers_in_x_shift = matrix[:, x][:y] #get the x'th column, until y'th worker (not included)
        if(sum(workers_in_x_shift)>self.amount_of_worker_in_shift[x]-1): #include the x,y one #to add amount of change the zero to the amount-1
            return False

        begin_of_day_by_shift = self.shift_start_by_day[x]
        shift_in_one_day_by_worker = matrix[y, begin_of_day_by_shift:x ]
        if(sum(shift_in_one_day_by_worker)>0):
            return False;
        return True


    def create_list_matrix_and_count_shift(self):
        result = []
        for matrix in self.test_list:
            result.append( (np.sum(matrix),matrix) )
        return result

    def get_list_of_max_matrix(self,tupple_count_matrix):
        list_matrix_with_max_count = []
        #find the maximum count in a matrix list
        count_max = max(tupple_count_matrix, key=itemgetter(0))[0]
        for tupple in tupple_count_matrix:
            if(tupple[0]==count_max):
                list_matrix_with_max_count.append(tupple[1])
        return list_matrix_with_max_count

    def get_max_rank_matrix(list_of_matrix, matrix_rank):
        return max(list_of_matrix,key=lambda m: np.sum(np.multiply(m,matrix_rank)))


    #
    #end = datetime.datetime.now()
    #elapsed = end - start

    #print(elapsed.seconds,":",elapsed.microseconds)

    '''
        def print_matrix(matrix):
            df = pd.DataFrame(matrix, columns=cols, index=rows)
            print(df)
            print("########")

        def print_list_as_matrix(test_list):
                for exp in test_list:
                    print_matrix(exp)
    '''


p = BuildShiftLogic(None,None);